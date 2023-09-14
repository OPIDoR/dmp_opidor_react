import React, { useEffect, useState } from "react";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { PiLightbulbLight } from "react-icons/pi";
import styles from "../assets/css/write_plan.module.css";
import guidanceChoiceStyles from "../assets/css/guidance_choice.module.css";
import { guidances } from "../../services";
import { CustomSpinner, CustomError } from "../Shared";
import CustomButton from "../Styled/CustomButton";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { MdOutlineCheckBoxOutlineBlank, MdIndeterminateCheckBox, MdCheckBox } from "react-icons/md";

const pannelStyle = {
  backgroundColor: "var(--white)",
  fontSize: "large",
  borderRadius: "5px",
  boxShadow: "5px 5px 5px #e5e4e7",
};

const description = {
  fontFamily: '"Helvetica Neue", sans-serif',
  color: "var(--secondary)",
  fontSize: "16px",
  margin: "10px 150px 0px 150px",
};

function GuidanceChoice({ planId }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  /**
   * Fetches recommendations and updates state variables.
   */
  useEffect(() => {
    setLoading(true);
    guidances.getGuidanceGroups(planId)
      .then((res) => {
        const { guidanceGroups } = res.data;
        setData(guidanceGroups);
        const states = handleGuidanceGroups(guidanceGroups);
        setCheckboxStates(states);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [planId]);

  const handleGuidanceGroups = (guidanceGroups) => {
    const states = {};
    for (let i = 0; i < guidanceGroups.length; i += 1) {
      const guidances = guidanceGroups[i].guidances.reduce((obj, item) => ({ ...obj, [item.id]: item.selected} ), {});
      const isSelected = Object.keys(guidances).filter((id) => guidances[id] === true).length > 0;
      states[guidanceGroups[i].id] = {
        checked: isSelected,
        guidances,
      };
    }
    return states;
  }

  /**
   * This function handles changes to a checkbox and updates the state accordingly, including updating nested checkboxes and an array of recommendation
   * IDs.
   */
  const handleCheckboxChange = (key, status) => {
    const states = { ...checkboxStates };

    states[key] = {
      ...states[key],
      checked: status,
      guidances: Object.keys(states[key].guidances).reduce((acc, el) => ({ ...acc, [el]: status }), {}),
    };

    setCheckboxStates(states);
  };

  /**
   * This function updates the state of nested checkboxes and also updates an array of recommended ids based on the checked checkboxes.
   */
  const handleNestedCheckboxChange = (parentKey, id, status) => {
    const states = { ...checkboxStates };

    states[parentKey] = {
      ...states[parentKey],
      guidances: {
        ...states[parentKey].guidances,
        [id]: status,
      }
    };

    const childChecked = Object.keys(states[parentKey].guidances).filter((id) => states[parentKey].guidances[id] === true);
    states[parentKey].checked = childChecked.length >= 1;

    setCheckboxStates(states);
  };

  const countSelectedGuidances = () => {
    return Object.values(checkboxStates).reduce((count, state) => {
      return state.checked === true ? count + 1 : count;
    }, 0);
  };

  const countSelectedChild = (parentId) => Object.keys(checkboxStates[parentId].guidances).filter((id) => checkboxStates[parentId].guidances[id] === true).length;

  /**
   * The function handles saving a choice and reloading a component in a JavaScript React application.
   */
  const handleSaveChoise = async () => {
    if (countSelectedGuidances <= 0) {
      return toast.error(t("Please select at least one recommendation"));
    }

    const selectedGuidancesIds = Object.keys(checkboxStates)
      .map((parentKey) => Object.keys(checkboxStates[parentKey].guidances).filter((guidanceKey) => checkboxStates[parentKey].guidances[guidanceKey] === true))
      .flat();

    let response;
    try {
      response = await guidances.postGuidanceGroups({ guidance_group_ids: selectedGuidancesIds }, planId);
    } catch (error) {
      return toast.error(t("An error occurred while saving the recommendations"));
    }

    const { guidanceGroups } = response.data;
    setData(guidanceGroups);
    const states = handleGuidanceGroups(guidanceGroups);
    setCheckboxStates(states);

    toast.success(t("Registration was successful !"));
  };

  return (
    <PanelGroup accordion id="accordion-guidance-choice">
      <Panel eventKey="1" style={pannelStyle}>
        <Panel.Heading style={{ background: "white", borderRadius: "5px" }}>
          <Panel.Title toggle onClick={(e) => setIsOpen(!isOpen)} style={{ background: "white", borderRadius: "5px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '100%', verticalAlign: 'middle', textAlign: 'center' }}>
                <PiLightbulbLight
                  fill={"var(--orange)"}
                  size={24}
                />
                <span style={{ fontSize: '24px', color: 'var(--primary)' }}>{t("Select the guidance of your plan")}</span>
              </div>
              {isOpen ? (
                <TfiAngleUp size={32} className={styles.down_icon} />
              ) : (
                <TfiAngleDown size={32} className={styles.down_icon} />
              )}
            </div>
          </Panel.Title>
        </Panel.Heading>
        {true && (
          <Panel.Body collapsible>
            <div style={description}>
              <div style={{ textAlign: 'justify' }}>
                {t(
                  "To help you write your plan, DMP OPIDoR offers you recommendations from different organizations - you can select up to 6 organizations."
                )}
              </div>
              {loading && <CustomSpinner />}
              {!loading && error && <CustomError error={error} />}
              {!loading && !error && data && (
                <div className="container" style={{ margin: "20px" }}>
                  {
                    data.filter(({ important }) => showAll || important === true).map((group, index) => (
                      <div key={`guidance-group-${index}`} className="form-check" style={{ margin: "5px" }}>
                        {
                          !checkboxStates[group.id].checked ? (
                            <MdOutlineCheckBoxOutlineBlank
                              style={{ cursor: 'pointer' }}
                              size={18}
                              onClick={() => handleCheckboxChange(group.id, true)}
                            />
                          ) : countSelectedChild(group.id) === 1 && Object.keys(checkboxStates[group.id].guidances).length > 1 ? (
                            <MdIndeterminateCheckBox
                              style={{ cursor: 'pointer' }}
                              size={18}
                              onClick={() => handleCheckboxChange(group.id, true)}
                            />
                          ) : (
                            <MdCheckBox
                              style={{ cursor: 'pointer' }}
                              size={18}
                              onClick={() => handleCheckboxChange(group.id, false)}
                            />
                          )
                        }
                        <label
                          className={`${guidanceChoiceStyles.label_checkbox} ${
                            checkboxStates[group.id].checked ? guidanceChoiceStyles.checked : ""
                          }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleCheckboxChange(group.id, !checkboxStates[group.id].checked)}
                        >
                          {group.name}
                        </label>
                        <div>
                          {
                            group.guidances.map((guidance, key) => (
                              <div key={guidance.id} className="form-check" style={{ marginLeft: "30px" }}>
                                {
                                  !checkboxStates[group.id].guidances[guidance.id] ? (
                                    <MdOutlineCheckBoxOutlineBlank
                                      style={{ cursor: 'pointer' }}
                                      size={18}
                                      onClick={() => handleNestedCheckboxChange(group.id, guidance.id, !checkboxStates[group.id].guidances[guidance.id])}
                                    />
                                  ) : (
                                    <MdCheckBox
                                      style={{ cursor: 'pointer' }}
                                      size={18}
                                      onClick={() => handleNestedCheckboxChange(group.id, guidance.id, !checkboxStates[group.id].guidances[guidance.id])}
                                    />
                                  )
                                }
                                <label
                                  className={`form-check-label ${guidanceChoiceStyles.guidance_group_title}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleNestedCheckboxChange(group.id, guidance.id, !checkboxStates[group.id].guidances[guidance.id])}
                                >
                                  {guidance.name}
                                </label>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <CustomButton
                  title={t("Save my choise")}
                  buttonType={countSelectedGuidances() > 0 ? "orange" : "primary"}
                  position="start"
                  handleClick={handleSaveChoise}
                />
                <CustomButton
                  title={t(showAll ? "Display importants guidances" : "Display all guidances")}
                  position="end"
                  buttonType="primary"
                  handleClick={() => setShowAll(!showAll)}
                />
              </div>
            </div>
          </Panel.Body>
        )}
      </Panel>
    </PanelGroup>
  );
}

export default GuidanceChoice;
