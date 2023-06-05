import React, { useContext, useEffect, useState } from "react";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown } from "react-icons/tfi";
import { TfiAngleUp } from "react-icons/tfi";
import styles from "../assets/css/redactions.module.css";
import LightSVG from "../Styled/svg/LightSVG";
import stylesRecomandation from "../assets/css/recommandation.module.css";
import { getRecommendation } from "../../services/DmpRecommandationApi";
import CustomSpinner from "../Shared/CustomSpinner";
import CustomError from "../Shared/CustomError";
import CustomButton from "../Styled/CustomButton";
import { useTranslation } from "react-i18next";

const pannelTitle = {
  margin: "0px !important",
  fontSize: "18px",
  fontWeight: "bold",
  marginRight: "60px",
  fontFamily: "custumHelveticaLight",
};

const questionText = {
  display: "flex",
  fontFamily: "custumHelveticaBold",
  fontSize: "29px",
  alignItems: "center",
};

const questionTitle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "var(--primary)",
};

const pannelStyle = {
  margin: "10px",
  backgroundColor: "var(--white)",
  fontSize: "large",
  borderRadius: "20px",
  boxShadow: "5px 5px 5px #e5e4e7",
};

function Recommandation({ planId }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRecommendation(planId)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckboxChange = (key) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [key]: !prevStates[key],
    }));
  };

  const handleSaveChoise = {};

  return (
    <PanelGroup accordion id="accordion-example">
      <Panel eventKey="1" style={pannelStyle}>
        <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
          <Panel.Title toggle onClick={(e) => setIsOpen(!isOpen)}>
            <div style={questionTitle}>
              <div style={questionText}>
                <div>
                  <LightSVG
                    fill={"var(--orange)"}
                    style={{ minWidth: "35px" }}
                    size={35}
                    className={styles.down_icon}
                    onClick={(e) => console.log("z")}
                  />
                </div>
                <div style={pannelTitle} />
                Sélectionnez vos recommandations du plan
                <span className={styles.question_icons}>
                  {isOpen ? (
                    <TfiAngleUp style={{ minWidth: "35px" }} size={35} className={styles.down_icon} onClick={(e) => console.log("z")} />
                  ) : (
                    <TfiAngleDown size={35} style={{ minWidth: "35px" }} className={styles.down_icon} onClick={(e) => console.log("z")} />
                  )}
                </span>
              </div>
            </div>
          </Panel.Title>
        </Panel.Heading>
        {true && (
          <Panel.Body collapsible>
            <div style={{ margin: "10px 180px 0px 180px" }}>
              <div>
                {t(
                  "To help you write your plan, DMP OPIDoR offers you recommendations from different organizations - you can select up to 6 organizations."
                )}
              </div>
              {loading && <CustomSpinner></CustomSpinner>}
              {!loading && error && <CustomError></CustomError>}
              {!loading && !error && data && (
                <div className="container" style={{ margin: "20px" }}>
                  {Object.keys(data.all).map((key, index) => (
                    <div key={index} className="form-check" style={{ margin: "5px" }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checkboxStates[key] || false}
                        onChange={() => handleCheckboxChange(key)}
                        id={`flexCheck${index}`}
                      />
                      <label
                        className={`${stylesRecomandation.label_checkbox} ${checkboxStates[key] ? stylesRecomandation.checked : ""}`}
                        htmlFor={`flexCheck${index}`}
                      >
                        {key}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <CustomButton title={t("Save my choise")} type="oorange" position="start" onClick={handleSaveChoise}></CustomButton>
            </div>
          </Panel.Body>
        )}
      </Panel>
    </PanelGroup>
  );
}

export default Recommandation;
