import React, { useState, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import InnerModal from "../Shared/InnerModal/InnerModal";
import { createFormLabel } from "../../utils/GeneratorUtils";
import CustomButton from "../Styled/CustomButton";
import { GlobalContext } from "../context/Global";
import { service } from "../../services";
import swalUtils from "../../utils/swalUtils";

function ModalRuns({ show, setshowModalRuns, setFillColorIconRuns, scriptsData, fragmentId }) {
  const { t } = useTranslation();
  const {
    locale,
    setFormData,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const modalRef = useRef(null);


  const handleRunScript = (scriptName) => {
    if (scriptsData?.apiClient && scriptName.includes('notifyer')) {
      Swal.fire(
        {
          ...swalUtils.defaultConfirmConfig(t),
          text:
            t(
              'By using this notification, you will allow {{clientName}} to access the full content of your plan. Do you confirm ?',
              { clientName: scriptsData?.apiClient?.name }
            )
        }
      ).then((result) => {
        if (result.isConfirmed) executeScript(scriptName);
      });
    }
    else {
      executeScript(scriptName);
    }
  }

  const handleCloseError = () => {
    setError(null);
    setLoading(false);
  }

  function executeScript(scriptName) {
    setLoading(true);
    service.runScript(fragmentId, scriptName).then((res) => {
      if (res.data.needs_reload) {
        setFormData({ [fragmentId]: res.data.fragment });
        setSuccess(t('New data is available in the form, you can close this window.'));
      } else {
        setSuccess(res.data.message);
      }
    }).catch((error) => {
      let errorMessage = t("An error occurred during the change of status of the plan");

      if (error.response) {
        errorMessage = error.response.data.error;
      } else if (error.request) {
        errorMessage = error.request;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError({
        home: false,
        code: error.response.status,
        error: errorMessage
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <InnerModal show={show} ref={modalRef}>
      <InnerModal.Header
        closeButton
        expandButton
        ref={modalRef}
        onClose={() => {
          setshowModalRuns(false);
          setFillColorIconRuns("var(--dark-blue)");
          setError(null);
          setSuccess(null);
        }}
      >
        <InnerModal.Title>
          {t('Runs')}
        </InnerModal.Title>
      </InnerModal.Header>
      <InnerModal.Body style={{ backgroundColor: "white" }}>
        {loading && <CustomSpinner isOverlay={true} />}
        {!loading && error && <CustomError error={error} showWarning={false} handleClose={handleCloseError} />}
        {!error &&
          <>
            {scriptsData.scripts.map((script, idx) => (
              <div key={idx}>
                <CustomButton handleClick={() => handleRunScript(script.name)} title={createFormLabel(script, locale)} buttonColor={"white"} position="center" />
                <span>{script?.[`tooltip@${locale}`]}</span>
              </div>
            ))}
          </>
        }
      </InnerModal.Body>
      <InnerModal.Footer>
        {success && <span style={{color: "var(--green)", fontWeight: "bold"}}>{success}</span>}
      </InnerModal.Footer>
    </InnerModal>
  );
}

export default ModalRuns;
