import React, { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { TbBulbFilled } from "react-icons/tb";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DOMPurify from "dompurify";

import { GlobalContext } from '../context/Global.jsx';
import * as guidanceChoiceStyles from "../../../src/components/assets/css/guidance_choice.module.css";
import { guidances } from "../../services";
import { CustomSpinner, CustomError } from "../Shared";
import CustomButton from "../Styled/CustomButton";
import { useTranslation, Trans } from "react-i18next";
import toast from "react-hot-toast";
import { MdOutlineCheckBoxOutlineBlank, MdIndeterminateCheckBox, MdCheckBox } from "react-icons/md";
import { GUIDANCES_GROUPS_LIMIT } from '../../config.js';

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
    locale,
  } = useContext(GlobalContext);

  /**
   * Fetches recommendations and updates state variables.
   */
  useEffect(() => {
    isClassic && setCurrentOrg({ id: currentOrgId, name: currentOrgName });

    const orgName = currentOrgName || currentOrg.name;

    setLoading(true);
    guidances.getGuidanceGroups(planId, locale)
      .then((res) => {
        let guidance_groups = [];
        const { data } = res.data;

        const orgGuidances = data.filter(({ name }) => name.toLowerCase() === orgName.toLowerCase());
        const selectedGuidances = sortGuidances(data.filter(({ important, name }) => important === true && name.toLowerCase() !== orgName.toLowerCase()));
        const unselectedGuidances = sortGuidances(data.filter(({ important, name }) => important === false && name.toLowerCase() !== orgName.toLowerCase()));

        guidance_groups = [ ...orgGuidances, ...selectedGuidances, ...unselectedGuidances ];

        setData(guidance_groups);
        const states = handleGuidanceGroups(guidance_groups);
        setCheckboxStates(states);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [planId]);

  const sortGuidances = (guidances) => guidances.sort((a, b) => a.name.localeCompare(b.name));

  const handleGuidanceGroups = (data) => {
    const states = {};
    for (let i = 0; i < data.length; i += 1) {
      const guidance_groups = data[i].guidance_groups.reduce((obj, item) => ({ ...obj, [item.id]: item.selected} ), {});
      const isSelected = Object.keys(guidance_groups).filter((id) => guidance_groups[id] === true).length > 0;
      states[data[i].id] = {
        checked: isSelected,
        guidance_groups,
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
      guidance_groups: Object.keys(states[key].guidance_groups).reduce((acc, el) => ({ ...acc, [el]: status }), {}),
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
      guidance_groups: {
        ...states[parentKey].guidance_groups,
        [id]: status,
      }
    };

    const childChecked = Object.keys(states[parentKey].guidance_groups).filter((id) => states[parentKey].guidance_groups[id] === true);
    states[parentKey].checked = childChecked.length >= 1;

    setCheckboxStates(states);
  };

  const countSelectedGuidances = () => {
    return Object.values(checkboxStates).reduce((count, state) => {
      return state.checked === true ? count + 1 : count;
    }, 0);
  };

  const countSelectedChild = (parentId) => Object.keys(checkboxStates[parentId].guidance_groups).filter((id) => checkboxStates[parentId].guidance_groups[id] === true).length;

  /**
   * The function handles saving a choice and reloading a component in a JavaScript React application.
   */
  const handleSaveChoice = async () => {
    if (countSelectedGuidances <= 0) {
      return toast.error(t("Please select at least one recommendation"));
    }

    const selectedGuidancesIds = Object.keys(checkboxStates)
      .map((parentKey) => Object.keys(checkboxStates[parentKey].guidance_groups).filter((guidanceKey) => checkboxStates[parentKey].guidance_groups[guidanceKey] === true))
      .flat();

    let response;
    try {
      response = await guidances.postGuidanceGroups({ guidance_group_ids: selectedGuidancesIds }, planId, locale);
    } catch (error) {
      return toast.error(t("An error occurred while saving the recommendations"));
    }

    const { guidance_groups } = response.data;

    let { questions_with_guidance } = response.data;

    const selectedGuidances = sortGuidances(guidance_groups.filter(({ important }) => important === true));
    const unselectedGuidances = sortGuidances(guidance_groups.filter(({ important }) => important === false));

    setData([ ...selectedGuidances, ...unselectedGuidances ]);

    setQuestionsWithGuidance(questions_with_guidance);
    const states = handleGuidanceGroups(guidance_groups);
    setCheckboxStates(states);

    document.querySelector('#plan-title').scrollIntoView({ behavior: 'smooth', block: 'start' });

    toast.success(t("Registration was successful !"));
  };

  const limitHasBeenReached = () => countSelectedGuidances() > GUIDANCES_GROUPS_LIMIT;

  if (data?.length === 0) {
    return (
      <div style={{
        width: '100%',
        border: '1px solid #cccccc',
        borderRadius: '4px',
        margin: '0 10px 0 10px',
        color: '#212529',
        backgroundColor: '#e9ecef',
        fontSize: '24px',
        textAlign: 'center',
        padding: '10px',
        cursor: 'not-allowed',
      }}>
        {t('No guidances available')}
      </div>
    );
  }

  return (
    <CardGroup accordion id="accordion-guidance-choice">
      <Card eventKey="1" className="funder-import">
        <Card.Header style={{ background: "var(--dark-blue)", borderRadius: isOpen ? "5px 5px 0 0" : "5px" }}>
          <Card.Title
            toggle
            onClick={(e) => setIsOpen(!isOpen)}
            style={{
              background: 'var(--dark-blue)',
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
                    <span style={{ color: 'var(--white)', marginTop: '3px' }}>{t("Click here to select the guidance of your plan")}</span>
                  </div>
                </div>
              </div>
              <div style={{ width: '30px', marginTop: '8px' }}>
                {isOpen ? (
                  <TfiAngleUp size={24} fill={"var(--white)"} />
                ) : (
                  <TfiAngleDown size={24} fill={"var(--white)"} />
                )}
              </div>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Body collapsible>
          <div style={description}>
            <div style={{ textAlign: 'justify' }}>
               <Trans
                defaults="You will find below a list of organizations offering recommendations and advice to guide you in writing your plan while respecting their data management policies. <bold>You can select up to 6 organizations</bold>. Then click to save your selection."
                components={{ br: <br />, bold: <strong /> }}
                />
            </div>
            <div style={{ marginTop: '20px' }}>
              {loading && <CustomSpinner />}
              {!loading && error && <CustomError error={error} />}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {!loading && !error && data && data.map((group, index) => (
                  <div key={`guidances-section-${index}`}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', }}
                      key={`guidances-container-${index}`}
                    >
                      <div
                        style={{ marginRight: '10px' }}
                        className={guidanceChoiceStyles.checkboxes}
                        key={`guidance-group-${index}`}
                      >
                        {limitHasBeenReached() && !checkboxStates[group.id].checked ? (
                          <MdOutlineCheckBoxOutlineBlank
                            fill="grey"
                            size={18}
                            key={`icon-${index}-checkbox-outline-blank-disabled`}
                            style={{ cursor: 'not-allowed' }}
                          />
                        ) : !checkboxStates[group.id].checked ? (
                          <MdOutlineCheckBoxOutlineBlank
                            style={{ cursor: 'pointer' }}
                            size={18}
                            key={`icon-${index}-checkbox-outline-blank`}
                            onClick={() => handleCheckboxChange(group.id, true)}
                          />
                        ) : countSelectedChild(group.id) === 1 && Object.keys(checkboxStates[group.id].guidance_groups).length > 1 ? (
                          <MdIndeterminateCheckBox
                            style={{ cursor: 'pointer' }}
                            size={18}
                            key={`icon-${index}-indeterminate-checkbox`}
                            onClick={() => handleCheckboxChange(group.id, true)}
                          />
                        ) : (
                          <MdCheckBox
                            style={{ cursor: 'pointer' }}
                            size={18}
                            key={`icon-${index}-checkbox`}
                            onClick={() => handleCheckboxChange(group.id, false)}
                          />
                        )}
                      </div>

                      <label
                        className={`${guidanceChoiceStyles.label_checkbox}`}
                        style={{ cursor: limitHasBeenReached() && !checkboxStates[group.id].checked ? 'not-allowed' : 'pointer' }}
                        onClick={() => {
                          if (!(limitHasBeenReached() && !checkboxStates[group.id].checked)) {
                            handleCheckboxChange(group.id, !checkboxStates[group.id].checked);
                          }
                        }}
                        key={`label-${index}-guidance-group`}
                      >
                        {group.name}
                      </label>
                    </div>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', marginLeft: '26px' }}
                      key={`guidance-group-${index}-childs`}
                    >
                      {
                        group.guidance_groups.map((guidance, key) => (
                          <div key={`guidance-group-${index}-childs-${key}-parent`}>
                            <div
                              style={{ display: 'flex', alignItems: 'center', }}
                              key={`guidance-group-${index}-childs-${key}-section`}
                              id={`guidance-group-${index}-childs-${key}-section`}
                            >
                              <div
                                style={{ marginRight: '10px' }}
                                className={guidanceChoiceStyles.checkboxes}
                                key={`guidance-group-${index}-childs-${key}-container`}
                              >
                                {
                                  limitHasBeenReached() && !checkboxStates[group.id].guidance_groups[guidance.id] ? (
                                    <MdOutlineCheckBoxOutlineBlank
                                      fill="grey"
                                      size={18}
                                      key={`icon-${index}-${key}-checkbox-outline-blank-disabled`}
                                      style={{ cursor: 'not-allowed' }}
                                    />
                                  ) : !checkboxStates[group.id].guidance_groups[guidance.id] ? (
                                    <MdOutlineCheckBoxOutlineBlank
                                      style={{ cursor: 'pointer' }}
                                      size={18}
                                      key={`icon-${index}-${key}-checkbox-outline-blank`}
                                      onClick={() => handleNestedCheckboxChange(group.id, guidance.id, !checkboxStates[group.id].guidance_groups[guidance.id])}
                                    />
                                  ) : (
                                    <MdCheckBox
                                      style={{ cursor: 'pointer' }}
                                      size={18}
                                      key={`icon-${index}-${key}-checkbox`}
                                      onClick={() => handleNestedCheckboxChange(group.id, guidance.id, !checkboxStates[group.id].guidance_groups[guidance.id])}
                                    />
                                  )
                                }
                              </div>
                              <ReactTooltip
                                id={`guidance-group-${index}-childs-${key}-tooltip`}
                                key={`guidance-group-${index}-childs-${key}-tooltip`}
                                place="bottom"
                                effect="solid"
                                variant="info"
                                content={guidance.description}
                              />
                              <label
                                data-tooltip-id={`guidance-group-${index}-childs-${key}-tooltip`}
                                className={`form-check-label ${guidanceChoiceStyles.guidance_group_title}`}
                                style={{ cursor: limitHasBeenReached() && !checkboxStates[group.id].guidance_groups[guidance.id] ? 'not-allowed' : 'pointer' }}
                                onClick={() => limitHasBeenReached() && !checkboxStates[group.id].guidance_groups[guidance.id] ? null : handleNestedCheckboxChange(group.id, guidance.id, !checkboxStates[group.id].guidance_groups[guidance.id])}
                              >
                                {guidance.name}
                              </label>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
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
                    buttonColor={countSelectedGuidances() > 0 ? "rust" : "blue"}
                    position="start"
                    handleClick={limitHasBeenReached() ? null : handleSaveChoice}
                    disabled={limitHasBeenReached()}
                  />
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </CardGroup>
  );
}

export default GuidanceChoice;
