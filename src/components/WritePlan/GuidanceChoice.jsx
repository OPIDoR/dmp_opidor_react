import React, { useContext, useEffect, useState, useRef } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Collapse from 'react-bootstrap/Collapse';
import { FaXmark } from 'react-icons/fa6';

import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { TbBulbFilled } from "react-icons/tb";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { GlobalContext } from '../context/Global.jsx';
import * as guidanceChoiceStyles from "../assets/css/guidance_choice.module.css";
import * as formStyles from '../assets/css/form.module.css';

import { guidances } from "../../services";
import { CustomSpinner, CustomError, CustomSelect } from "../Shared";
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

function GuidanceChoice({
  planId,
  researchOutputId,
  setSelectedGuidances = null,
  topic = null,
  currentOrgId = null,
  currentOrgName = null,
  context = 'research_output' }) {
  const { t } = useTranslation();
  const [guidancesData, setGuidancesData] = useState([]);
  const [filteredGuidancesData, setFilteredGuidancesData] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [includeTopic, setIncludeTopic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const {
    setCurrentOrg,
    currentOrg,
  } = useContext(GlobalContext);
  const guidancesRef = useRef(null);

  /**
   * Fetches recommendations and updates state variables.
   */
  useEffect(() => {
    context === 'plan' && setCurrentOrg({ id: currentOrgId, name: currentOrgName });
    const fetchGuidanceGroups = context === 'plan' ? guidances.getPlanGuidanceGroups(planId) : guidances.getResearchOutputGuidanceGroups(researchOutputId)
    const orgName = currentOrgName || currentOrg.name;

    setLoading(true);
    fetchGuidanceGroups
      .then((res) => {
        let guidance_groups = [];
        const { data } = res.data;

        const orgGuidances = data.filter(({ name }) => name.toLowerCase() === orgName.toLowerCase());
        const selectedGuidances = sortGuidances(data.filter(({ important, name }) => important === true && name.toLowerCase() !== orgName.toLowerCase()));
        const unselectedGuidances = sortGuidances(data.filter(({ important, name }) => important === false && name.toLowerCase() !== orgName.toLowerCase()));

        guidance_groups = [...selectedGuidances, ...orgGuidances, ...unselectedGuidances];

        setSelectedGuidances(formatSelectedGuidances(selectedGuidances));
        setGuidancesData(guidance_groups);
        const states = handleGuidanceGroups(guidance_groups);
        setCheckboxStates(states);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [planId]);

  useEffect(() => {
    if (guidancesData.length === 0) return;
    let filtered = [...guidancesData]
    if (includeTopic) {
      filtered = filtered.filter((org) => org.guidance_groups.find((gg) => gg.topics.includes(topic)));
    }
    if (selectedOrg !== null) {
      filtered = filtered.filter((group) => group.name === selectedOrg);
    }
    setFilteredGuidancesData(filtered);
  }, [guidancesData, selectedOrg, includeTopic]);

  const sortGuidances = (guidances) => guidances.sort((a, b) => a.name.localeCompare(b.name));

  const handleGuidanceGroups = (data) => {
    const states = {};
    for (let i = 0; i < data.length; i += 1) {
      const guidance_groups = data[i].guidance_groups.reduce((obj, item) => ({ ...obj, [item.id]: item.selected }), {});
      const isSelected = Object.keys(guidance_groups).filter((id) => guidance_groups[id] === true).length > 0;
      states[data[i].id] = {
        checked: isSelected,
        guidance_groups,
      };
    }
    return states;
  }

  const formatSelectedGuidances = (selectedGuidances) => {
    return selectedGuidances.flatMap(org =>
      org.guidance_groups
        .filter(group => group.selected)
        .map(group => ({
          id: group.id,
          title: group.name,
          orgName: org.name
        }))
    );
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
      return toast.error(t("selectAtLeastOne"));
    }

    const selectedGuidancesIds = Object.keys(checkboxStates)
      .map((parentKey) => Object.keys(checkboxStates[parentKey].guidance_groups).filter((guidanceKey) => checkboxStates[parentKey].guidance_groups[guidanceKey] === true))
      .flat();

    let response;
    try {
      const postGuidanceGroups = context === 'plan' ?
        guidances.postPlanGuidanceGroups({ guidance_group_ids: selectedGuidancesIds, ro_id: researchOutputId }, planId) :
        guidances.postResearchOutputGuidanceGroups({ guidance_group_ids: selectedGuidancesIds }, researchOutputId)
      response = await postGuidanceGroups;
    } catch (error) {
      console.log(error);
      return toast.error(t("errorSavingSelectedGuidances"));
    }

    const { guidance_groups } = response.data;

    const selectedGuidances = sortGuidances(guidance_groups.filter(({ important }) => important === true));
    const unselectedGuidances = sortGuidances(guidance_groups.filter(({ important }) => important === false));

    setSelectedGuidances(formatSelectedGuidances(selectedGuidances));
    setGuidancesData([...selectedGuidances, ...unselectedGuidances]);

    const states = handleGuidanceGroups(guidance_groups);
    setCheckboxStates(states);

    guidancesRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    toast.success(t("registrationSuccess"));
  };

  const limitHasBeenReached = () => countSelectedGuidances() > GUIDANCES_GROUPS_LIMIT;

  const shouldGuidanceGroupDisplay = (guidanceGroup) => {
    if (includeTopic) {
      return guidanceGroup.topics.includes(topic);
    } else {
      return true;
    }
  }

  if (guidancesData?.length === 0) {
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
        {t("noGuidancesAvailable")}
      </div>
    );
  }

  return (
    <Card
      id="accordion-guidance-choice"
      className={guidanceChoiceStyles.card}
      style={{
        border: "2px solid var(--dark-blue)",
        borderRadius: "10px",
      }}>
      <Card.Header style={{ background: "var(--dark-blue)", borderRadius: isOpen ? "5px 5px 0 0" : "5px" }}>
        <Button
          style={{ backgroundColor: 'var(--dark-blue)', width: '100%', border: 'none', margin: '0' }}
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="guidance-choice-collapse"
          aria-expanded={isOpen}
        >
          <Card.Title style={{ margin: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flexGrow: 3, fontSize: '24px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TbBulbFilled
                  fill={'var(--rust)'}
                  size={38}
                  style={{ marginRight: '10px', color: 'var(--rust)' }}
                />
                <span style={{ color: 'var(--white)', marginTop: '3px' }}>{
                  context === 'plan' ? t("selectGuidancePlan") : t("selectGuidanceOutput")
                }</span>
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
        </Button>
      </Card.Header>
      <Collapse in={isOpen}>
        <div id="guidance-choice-collapse">
          <Card.Body>
            <div style={description}>
              <div style={{ textAlign: 'justify' }}>
                <Trans
                  i18nKey="guidanceListInfo"
                  components={{ br: <br />, bold: <strong /> }}
                />
              </div>
              {!loading && !error && guidancesData && context === 'research_output' && (
                <div className="row" style={{ padding: '10px' }}>
                  <div className="col-md-12" style={{ padding: '10px 0', color: 'var(--rust)' }}>
                    {t('Below you can filter available guidances with the topic linked to your research output or the org making them available.')}
                  </div>
                  <div className={`col-md-7 ${formStyles.select_wrapper}`} style={{ alignContent: 'center' }}>
                    <CustomSelect
                      onSelectChange={(o) => setSelectedOrg(o.value)}
                      options={guidancesData.map((group) => ({ label: group.name, value: group.name }))}
                      selectedOption={selectedOrg ? { label: selectedOrg, value: selectedOrg } : null}
                      name="guidanceOrg"
                      placeholder={t("selectAnOrganisation")}
                    />
                  </div>
                  <div className="col-md-1" style={{ alignContent: 'center' }}>
                    <FaXmark
                      onClick={() => setSelectedOrg(null)}
                      className={formStyles.icon}
                    />
                  </div>
                  <div className="col-md-3" style={{ alignContent: 'center' }}>
                    {t("includeTopic")} ({topic})
                  </div>
                  <div className="col-md-1" style={{ alignContent: 'center' }}>
                    <input type="checkbox" onChange={() => setIncludeTopic(!includeTopic)} checked={includeTopic} />
                  </div>
                </div>
              )}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', maxHeight: '500px', position: 'relative' }}>
                {loading && <CustomSpinner />}
                {!loading && error && <CustomError error={error} />}
                <div ref={guidancesRef} style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', marginBottom: '70px', scrollbarWidth: 'thin', scrollbarColor: 'var(--rust) lightgray' }}>
                  {!loading && !error && (
                    filteredGuidancesData.length > 0 ?
                      filteredGuidancesData.map((group, index) => (
                        <div key={`guidances-section-${index}`} style={{ paddingBottom: '5px' }}>
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                            key={`guidances-container-${index}`}
                          >
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
                                  <React.Fragment key={`guidance-fragment-${index}-${key}`}>
                                    {shouldGuidanceGroupDisplay(guidance) &&

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
                                          {guidance.description && <ReactTooltip
                                            id={`guidance-group-${index}-childs-${key}-tooltip`}
                                            key={`guidance-group-${index}-childs-${key}-tooltip`}
                                            place="bottom"
                                            effect="solid"
                                            variant="info"
                                          >
                                            <div dangerouslySetInnerHTML={{ __html: guidance.description }}></div>
                                          </ReactTooltip>}
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
                                    }
                                  </React.Fragment>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      )) : t("noGuidancesAvailable")
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '0' }}>
                  {!loading && !error && guidancesData && (
                    <CustomButton
                      title={
                        limitHasBeenReached() ? t('guidanceLimitReached', { limit: GUIDANCES_GROUPS_LIMIT }) : t("save")
                      }
                      buttonColor={countSelectedGuidances() > 0 ? "rust" : "blue"}
                      position="start"
                      handleClick={limitHasBeenReached() ? null : handleSaveChoice}
                      disabled={limitHasBeenReached()}
                    />
                  )}
                </div>
              </div >
            </div >
          </Card.Body >
        </div >
      </Collapse >
    </Card >
  );
}

export default GuidanceChoice;
