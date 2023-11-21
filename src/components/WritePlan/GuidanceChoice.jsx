import React, { useContext, useEffect, useState } from "react";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { TbBulbFilled } from "react-icons/tb";
import { GlobalContext } from '../context/Global.jsx';
import guidanceChoiceStyles from "../../../src/components/assets/css/guidance_choice.module.css";
import { guidances } from "../../services";
import { CustomSpinner, CustomError } from "../Shared";
import CustomButton from "../Styled/CustomButton";
import { useTranslation, Trans } from "react-i18next";
import toast from "react-hot-toast";
import { MdOutlineCheckBoxOutlineBlank, MdIndeterminateCheckBox, MdCheckBox } from "react-icons/md";
import DOMPurify from 'dompurify';
import { GUIDANCES_GROUPS_LIMIT } from '../../config.js';

const panelStyle = {
  backgroundColor: "var(--white)",
  fontSize: "large",
  borderRadius: "5px",
  boxShadow: "5px 5px 5px #e5e4e7",
};

const description = {
  fontFamily: '"Helvetica Neue", sans-serif',
  color: "var(--blue)",
  fontSize: "16px",
  margin: "10px 150px 0px 150px",
};

function GuidanceChoice({ planId, currentOrgId, currentOrgName, isClassic }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const {
    setQuestionsWithGuidance,
    setCurrentOrg,
    currentOrg,
  } = useContext(GlobalContext);

  /**
   * Fetches recommendations and updates state variables.
   */
  useEffect(() => {
    isClassic && setCurrentOrg({ id: currentOrgId, name: currentOrgName });

    const orgName = currentOrgName || currentOrg.name;

    setLoading(true);
    guidances.getGuidanceGroups(planId)
      .then((res) => {
        let { guidance_groups } = res.data;

        const orgGuidances = guidance_groups.filter(({ name }) => name.toLowerCase() === orgName.toLowerCase());
        const selectedGuidances = sortGuidances(guidance_groups.filter(({ important, name }) => important === true && name.toLowerCase() !== orgName.toLowerCase()));
        const unselectedGuidances = sortGuidances(guidance_groups.filter(({ important, name }) => important === false && name.toLowerCase() !== orgName.toLowerCase()));

        guidance_groups = [ ...orgGuidances, ...selectedGuidances, ...unselectedGuidances ];

        setData(guidance_groups);
        const states = handleGuidanceGroups(guidance_groups);
        setCheckboxStates(states);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [planId]);

  const sortGuidances = (guidances) => guidances.sort((a, b) => a.name.localeCompare(b.name));

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

    let { guidance_groups } = response.data;

    let {  questions_with_guidance } = response.data;

    const selectedGuidances = sortGuidances(guidance_groups.filter(({ important }) => important === true));
    const unselectedGuidances = sortGuidances(guidance_groups.filter(({ important }) => important === false));

    guidance_groups = [ ...selectedGuidances, ...unselectedGuidances ];

    setData(guidance_groups);

    setQuestionsWithGuidance(questions_with_guidance);
    const states = handleGuidanceGroups(guidance_groups);
    setCheckboxStates(states);

    document.querySelector('#plan-title').scrollIntoView({ behavior: 'smooth', block: 'start' });

    toast.success(t("Registration was successful !"));
  };

  const limitHasBeenReached = () => countSelectedGuidances() > GUIDANCES_GROUPS_LIMIT;

  return (
    <PanelGroup accordion id="accordion-guidance-choice">
      <Panel eventKey="1" style={panelStyle}>
        <Panel.Heading style={{ background: "white", borderRadius: "5px" }}>
          <Panel.Title
            toggle
            onClick={(e) => setIsOpen(!isOpen)}
            style={{
              background: 'white',
              borderRadius: '5px',
              fontWeight: 900,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flexGrow: 3, alignItems: 'center', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TbBulbFilled
                      fill={'var(--rust)'}
                      size={38}
                      style={{ marginRight: '10px', color: 'var(--rust)' }}
                    />
                    <span style={{ color: 'var(--dark-blue)', marginTop: '3px' }}>{t("Select the guidance of your plan")}</span>
                  </div>
                </div>
              </div>
              <div style={{ width: '30px', marginTop: '8px' }}>
                {isOpen ? (
                  <TfiAngleUp size={24} fill={"var(--rust)"} />
                ) : (
                  <TfiAngleDown size={24} fill={"var(--rust)"} />
                )}
              </div>
            </div>
          </Panel.Title>
        </Panel.Heading>
        {true && (
          <Panel.Body collapsible>
            <div style={description}>
              <div
                style={{ textAlign: 'justify' }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize([t(
                    "To help you write your plan, DMP OPIDoR offers you recommendations from different organizations - <strong>you can select up to 6 organizations</strong>."
                  )]),
                }}
              >
              </div>
              <div style={{ marginTop: '20px' }}>
                {loading && <CustomSpinner />}
                {!loading && error && <CustomError error={error} />}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {!loading && !error && data && data.map((group, index) => (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', }}>
                        <div style={{ marginRight: '10px' }} className={guidanceChoiceStyles.checkboxes}>
                          {limitHasBeenReached() && !checkboxStates[group.id].checked ? (
                            <MdOutlineCheckBoxOutlineBlank
                              fill="grey"
                              size={18}
                              style={{ cursor: 'not-allowed' }}
                            />
                          ) : !checkboxStates[group.id].checked ? (
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
                          )}
                        </div>

                        <label
                          className={`${guidanceChoiceStyles.label_checkbox} ${
                            checkboxStates[group.id].checked ? guidanceChoiceStyles.checked : ""
                          }`}
                          style={{ cursor: limitHasBeenReached() && !checkboxStates[group.id].checked ? 'not-allowed' : 'pointer' }}
                          onClick={() => {
                            if (!(limitHasBeenReached() && !checkboxStates[group.id].checked)) {
                              handleCheckboxChange(group.id, !checkboxStates[group.id].checked);
                            }
                          }}
                        >
                          {group.name}
                        </label>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '26px' }}>
                        {
                          group.guidances.map((guidance, key) => (
                            <div style={{ display: 'flex', alignItems: 'center', }}>
                              <div style={{ marginRight: '10px' }} className={guidanceChoiceStyles.checkboxes}>
                                {
                                  limitHasBeenReached() && !checkboxStates[group.id].guidances[guidance.id] ? (
                                    <MdOutlineCheckBoxOutlineBlank
                                      fill="grey"
                                      size={18}
                                      style={{ cursor: 'not-allowed' }}
                                    />
                                  ) : !checkboxStates[group.id].guidances[guidance.id] ? (
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
                              </div>

                              <label
                                className={`form-check-label ${guidanceChoiceStyles.guidance_group_title}`}
                                style={{ cursor: limitHasBeenReached() && !checkboxStates[group.id].guidances[guidance.id] ? 'not-allowed' : 'pointer' }}
                                onClick={() => limitHasBeenReached() && !checkboxStates[group.id].guidances[guidance.id] ? null : handleNestedCheckboxChange(group.id, guidance.id, !checkboxStates[group.id].guidances[guidance.id])}
                              >
                                {guidance.name}
                              </label>
                            </div>
                          ))
                        }
                      </div>
                    </>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {!loading && !error && data && (
                    <CustomButton
                      title={
                        limitHasBeenReached() ? (
                          <Trans>
                            The limit of {{ limit: GUIDANCES_GROUPS_LIMIT }} groups of recommendations has been reached
                          </Trans>
                        ) : t('Save')
                      }
                      buttonColor={countSelectedGuidances() > 0 ? "orange" : "primary"}
                      position="start"
                      handleClick={limitHasBeenReached() ? null : handleSaveChoise}
                      disabled={limitHasBeenReached()}
                    />
                  )}
                </div>
              </div>
            </div>
          </Panel.Body>
        )}
      </Panel>
    </PanelGroup>
  );
}

export default GuidanceChoice;
