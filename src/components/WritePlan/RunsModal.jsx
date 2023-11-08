import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { guidances } from "../../services";
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import { NavBody, NavBodyText, Description, ButtonComment } from "./styles/RunsModalStyles";
import InnerModal from "../Shared/InnerModal/InnerModal";

function ModalRuns({ show, setshowModalRuns, setFillColorIconRuns }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  const modalStyles = {
    display: show ? "block" : "none",
    position: "absolute",
    zIndex: 99,
    background: "var(--dark-blue)",
    padding: "0px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginLeft: "-725px",
    marginTop: "410px",
    width: "550px",
    height: "380px",
    color: "var(--white)",
  };

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    // setLoading(true);
    // guidances.getGuidances("")
    //   .then((res) => {
    //     setData(res.data);
    //   })
    //   .catch((error) => setError(error))
    //   .finally(() => setLoading(false));
  }, []);

  return (
    <InnerModal show={show} ref={modalRef}>
      <InnerModal.Header
        closeButton
        expandButton
        ref={modalRef}
        onClose={() => {
          setshowModalRuns(false);
          setFillColorIconRuns("var(--dark-blue)");
        }}
      >
        <InnerModal.Title>
          {t('Runs')}
        </InnerModal.Title>
      </InnerModal.Header>
      <InnerModal.Body>
        {loading && <CustomSpinner />}
        {!loading && error && <CustomError error={error} />}
        {!loading && !error && data && (
          <NavBody>
            <NavBodyText>
              <div style={{ margin: 10 }}>
                <ButtonComment className="btn btn-light">{t("Calculate storage cost")}</ButtonComment>
              </div>
              <Description>
                {t(
                  "The storage prices (excluding VAT) of the mesocentre are subject to the general conditions of sale of the University of Montpellier: URL address"
                )}
              </Description>

              <div style={{ margin: 10 }}>
                <ButtonComment className="btn btn-light">{t("Notify MESO@LR")}</ButtonComment>
              </div>
              <Description>
                {t(
                  "The storage prices (excluding VAT) of the mesocentre are subject to the general conditions of sale of the University of Montpellier: URL address"
                )}
              </Description>
            </NavBodyText>
          </NavBody>
        )}
      </InnerModal.Body>
    </InnerModal>
  );
}

export default ModalRuns;
