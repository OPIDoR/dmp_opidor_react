import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGuidance } from "../../services/DmpGuidanceApi";
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import { NavBody, NavBodyText, Description, MainNav, Close, ButtonComment, Title } from "./styles/RunsModalStyles";

function ModalRuns({ show, setshowModalRuns, setFillColorIconRuns }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const modalStyles = {
    display: show ? "block" : "none",
    position: "absolute",
    zIndex: 99,
    background: "var(--primary)",
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
    setLoading(true);
    getGuidance("", "")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={modalStyles}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <MainNav>
        <div></div>
        <Close
          className="close"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setshowModalRuns(false);
            setFillColorIconRuns("var(--primary)");
          }}
        >
          x
        </Close>
      </MainNav>
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError></CustomError>}
      {!loading && !error && data && (
        <NavBody>
          <Title>Runs</Title>
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
    </div>
  );
}

export default ModalRuns;
