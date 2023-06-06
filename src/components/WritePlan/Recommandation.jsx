import React, { useContext, useEffect, useState } from "react";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown } from "react-icons/tfi";
import { TfiAngleUp } from "react-icons/tfi";
import styles from "../assets/css/redactions.module.css";
import LightSVG from "../Styled/svg/LightSVG";
import stylesRecomandation from "../assets/css/recommandation.module.css";
import { getRecommendation, postRecommandation } from "../../services/DmpRecommandationApi";
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

function Recommandation({ planId, setTriggerRender }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [idsRecommandations, setIdsRecommandations] = useState([]);

  /* This is a React hook called `useEffect` that is used to perform side effects in functional components. In this case, it is used to fetch data from an
API using the `getRecommendation` function and update the component state with the fetched data using the `setData` function. */
  useEffect(() => {
    setLoading(true);
    getRecommendation(planId)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  /**
   * This function handles changes to a checkbox and updates the state accordingly, including updating nested checkboxes and an array of recommendation
   * IDs.
   */
  const handleCheckboxChange = (key) => {
    setCheckboxStates((prevState) => {
      const newState = { ...prevState };
      const newValue = !(newState[key] && newState[key]["parent"]);
      newState[key] = { parent: newValue };
      // Update the nested checkboxes
      data.all[key].forEach((value) => {
        newState[key][value.id] = newValue;
        // Update the idsRecommandations array
        if (newValue) {
          setIdsRecommandations((prev) => [...prev, value.id]);
        } else {
          setIdsRecommandations((prev) => prev.filter((id) => id !== value.id));
        }
      });

      return newState;
    });
  };

  /**
   * This function updates the state of nested checkboxes and also updates an array of recommended ids based on the checked checkboxes.
   */
  const handleNestedCheckboxChange = (parentKey, id) => {
    setCheckboxStates((prevState) => {
      const newState = { ...prevState };
      const newValue = !newState[parentKey][id];
      newState[parentKey][id] = newValue;
      // Update the idsRecommandations array
      if (newValue) {
        setIdsRecommandations((prev) => [...prev, id]);
      } else {
        setIdsRecommandations((prev) => prev.filter((existingId) => existingId !== id));
      }

      return newState;
    });
  };

  /**
   * The function handles saving a choice and reloading a component in a JavaScript React application.
   */
  const handleSaveChoise = () => {
    // add this to reload the WhritePlan component
    setTriggerRender((prevState) => prevState + 1);
    postRecommandation(idsRecommandations, planId)
      .then((res) => {
        console.log(res);
      })
      .then(() => {
        setTriggerRender((prevState) => prevState + 1);
        console.log(idsRecommandations);
      });
  };

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
                {t("Select the guidance of your plan")}
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
                  {Object.entries(data.all).map(([key, values], index) => (
                    <div key={index} className="form-check" style={{ margin: "5px" }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checkboxStates[key] && checkboxStates[key]["parent"]}
                        onChange={() => handleCheckboxChange(key)}
                        id={`flexCheck${index}`}
                      />
                      <label
                        className={`${stylesRecomandation.label_checkbox} ${
                          checkboxStates[key] && checkboxStates[key]["parent"] ? stylesRecomandation.checked : ""
                        }`}
                        htmlFor={`flexCheck${index}`}
                      >
                        {key}
                      </label>
                      <div>
                        {values.map((value) => (
                          <div key={value.id} className="form-check" style={{ marginLeft: "30px" }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={checkboxStates[key] && checkboxStates[key][value.id]}
                              onChange={() => handleNestedCheckboxChange(key, value.id)}
                              id={`flexCheckNested${value.id}`}
                            />
                            <label className="form-check-label" htmlFor={`flexCheckNested${value.id}`}>
                              {value.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <CustomButton
                title={t("Save my choise")}
                type={idsRecommandations.length > 0 ? "oorange" : "primary"}
                position="start"
                handleClick={handleSaveChoise}
              ></CustomButton>
            </div>
          </Panel.Body>
        )}
      </Panel>
    </PanelGroup>
  );
}

export default Recommandation;
