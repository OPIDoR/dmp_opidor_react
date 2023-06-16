import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getDefaultTemplate,
  getFunders,
  getTemplatesByFunderId,
  getOrgs,
  getTemplatesByOrgId,
  createPlan
} from "../../services/DmpPlanCreationApi";
import { GlobalContext } from "../context/Global";
import Swal from "sweetalert2";
import styles from "../assets/css/steps.module.css";
import CustomButton from "../Styled/CustomButton";
import CircleTitle from "../Styled/CircleTitle";
import { toast } from "react-hot-toast";
import CustomSelect from "../Shared/CustomSelect";

/* The above code is a React functional component that renders a form with radio buttons to select a template for a document. It fetches data from APIs
using useEffect hooks and uses react-select library to create dropdown menus. It also has functions to handle the selection of options and to send the
selected template ID to the next step. */
function SecondStep() {
  const { t } = useTranslation();
  const { researchContext, setResearchContext, currentOrg } = useContext(GlobalContext);

  const [isShowDefaultTemplate, setIsShownDefaultTemplate] = useState(true)
  const [defaultTemplate, setDefaultTemplate] = useState(null);
  const [defaultTemplateId, setDefaultTemplateId] = useState(null);

  const [isShownMyOrg, setIsShownMyOrg] = useState(false);
  const [myOrgTemplatesList, setMyOrgTemplatesList] = useState(null);

  const [isShownOrgs, setIsShownOrgs] = useState(false);
  const [orgsList, setOrgsList] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(t('Begin typing to see a list of suggestions.'));
  const [selectedOrgTemplates, setSelectedOrgTemplates] = useState(null);

  const [isShownFunder, setIsShownFunder] = useState(false);
  const [fundersList, setFundersList] = useState(null);
  const [selectedFunder, setSelectedFunder] = useState(t('Begin typing to see a list of suggestions.'));
  const [selectedFunderTemplates, setSelectedFunderTemplates] = useState(null);

  const [selectedTemplate, setSelectedTemplate] = useState(null)


  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    getTemplatesByOrgId(currentOrg, researchContext).then((res) => {
      setMyOrgTemplatesList(res.data);
    });
  }, [currentOrg, researchContext]);

  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    getDefaultTemplate().then((res) => {
      setDefaultTemplate(res.data);
      setResearchContext(researchContext);
      setDefaultTemplateId(res.data.id);
      setSelectedTemplate(res.data.id);
    });
  }, []);

  /**
   * If the value is 1, 2, or 3, then set the value of isShowListOrg to false, set the value of isShowOrg to false, set the value of organismes
   * to null, set the value of isShowFunder to false, set the value of valueFunder to t('Begin typing to see a list of suggestions.'), set the value
   * of isShowOtherOrganisme to true, and set the value of isShowListFunder to false.
   *
   * If the value is 2, then set the value of isShowListOrg to true, set the value of isShowOrg to false, set the value of organismes to null,
   * set the value of isShowFunder to false, set the value of valueFunder to t('Begin typing to see a list of suggestions.'), set the value of
   * isShowOtherOrgan
   */
  const handleCheckOption = (val) => {
    switch (val) {
      case "defaultTemplate":
        //state
        setResearchContext(researchContext);
        setSelectedTemplate(defaultTemplateId);
        setIsShownDefaultTemplate(true);
        // hide my org
        setIsShownMyOrg(false);
        // hide other org
        setIsShownOrgs(false);
        setSelectedOrg(t('Begin typing to see a list of suggestions.'));
        setSelectedOrgTemplates(null);
        // hide funder
        setIsShownFunder(false);
        setSelectedFunder(t('Begin typing to see a list of suggestions.'));
        setIsShownFunder(false);

        break;
      case "myOrg": // my org
        //state
        setResearchContext(researchContext);
        setSelectedTemplate(null);
        setIsShownDefaultTemplate(false);
        // show my org
        setIsShownMyOrg(true);
        // hide other org
        setIsShownOrgs(false);
        setSelectedOrg(t('Begin typing to see a list of suggestions.'));
        setSelectedOrgTemplates(null);
        // hide funder
        setIsShownFunder(false);
        setSelectedFunder(t('Begin typing to see a list of suggestions.'));
        break;
      case "orgs": // Other org
        //state
        setResearchContext(researchContext);
        setSelectedTemplate(null);
        setIsShownDefaultTemplate(false);
        // hide my org
        setIsShownMyOrg(false);
        // show other org
        if(!orgsList) handleFetchOrgs();
        setIsShownOrgs(true);
        setSelectedOrgTemplates(null);
        // hide funder
        setIsShownFunder(false);
        setSelectedFunder(t('Begin typing to see a list of suggestions.'));
        setSelectedFunderTemplates(null);
        break;
      default: // Funder
        //state
        setResearchContext(researchContext);
        setSelectedTemplate(null);
        setIsShownDefaultTemplate(false);
        // hide my org
        setIsShownMyOrg(false);
        // hide other org
        setIsShownOrgs(false);
        setSelectedOrg(t('Begin typing to see a list of suggestions.'));
        // show funder
        if(!fundersList) handleFetchFunders();
        setIsShownFunder(true);
        setSelectedFunderTemplates(null);
        break;
    }
  };

  /**
   * Calls ths API and fetch the orgs list according to the given context
   */
  const handleFetchOrgs = () => {
    getOrgs(researchContext).then((res) => {
      const options = res.data.map((option) => ({
        value: option.id,
        label: option.name,
        object: option,
      }));
      setOrgsList(options);
    });
  };


  /**
   * Calls ths API and fetch the funders list according to the given context
   */
  const handleFetchFunders = () => {
    getFunders(researchContext).then((res) => {
      const options = res.data.map((option) => ({
        value: option.id,
        label: option.name,
        object: option,
      }));
      setFundersList(options);
    });
  };

  /**
   * I want to make an API call to get some data. I
   * want to set the state of the component to the data I get from the API call.
   * I'm using the react-select library to create a dropdown menu.
   */
  const handleSelectOrg = (e) => {
    const orgData = e.object;
    getTemplatesByOrgId(orgData, researchContext).then((res) => {
      setSelectedOrg(orgData);
      setSelectedOrgTemplates(res.data);
    });
  };

  /**
   * I'm trying to get the value of the selected option from the d
   * ropdown and pass it to the function getFunderById.
   */
  const handleSelectFunder = (e) => {
    const funderData = e.object;
    getTemplatesByFunderId(funderData, researchContext).then((res) => {
      setSelectedFunder(funderData);
      setSelectedFunderTemplates(res.data);
    });
  };

  /**
   * The function checks if a template ID exists in a context object and logs it, or displays an error message if it doesn't exist.
   */
  const handleSendTemplateId = () => {
    if (!selectedTemplate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t("You must choose a model"),
      });
    } else {
      createPlan(selectedTemplate).then((res) => {
        window.location = `/plans/${res.data.id}`
      }).catch((res) => {
        toast.error(res.data.message);
      })
    }
  };

  return (
    <div>
      <CircleTitle number="2" title={t('Choose your template')}></CircleTitle>
      <div className="column">
        <div className="form-check">
          <input
            className={`form-check-label ${styles.check}`}
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            defaultChecked
            onClick={() => handleCheckOption("defaultTemplate")}
          />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault1">
            {t('Default template')}
          </label>
          {isShowDefaultTemplate &&
            <div className={styles.list_context}>{defaultTemplate && defaultTemplate?.title}</div>
          }
        </div>
        <div className="form-check">
          <input 
            className="form-check-input" 
            type="radio" 
            name="flexRadioDefault" 
            id="flexRadioDefault2" 
            onClick={() => handleCheckOption("myOrg")} />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault2">
            {currentOrg.name} ({t('your organisation')})
          </label>

          <div className={styles.list_organisme}>
            {isShownMyOrg &&
              myOrgTemplatesList &&
              myOrgTemplatesList.map((el) => (
                <label key={el.id} className={`${styles.element_organisme} ${styles.label_sous_title}`}>
                  <input type="radio" id={el.id} name="contact" onClick={() => setSelectedTemplate(el.id)} />
                  {/* <label htmlFor={el.id}>{el.title}</label> */}
                  <div className={styles.list_element}>{el.title}</div>
                </label>
              ))}
          </div>
        </div>
        <div className="form-check">
          <input 
            className="form-check-input" 
            type="radio" 
            name="flexRadioDefault" 
            id="flexRadioDefault3" 
            onClick={() => handleCheckOption("orgs")} />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault3">
            {t('Other organisation')}
          </label>
          { isShownOrgs && 
            <div className={styles.select}>
              {orgsList && (
                <CustomSelect
                  options={orgsList}
                  onChange={handleSelectOrg}
                  selectedOption={{
                    label: selectedOrg.name,
                    value: selectedOrg.id,
                  }}
                />
              )}
              <div className={styles.list_organisme}>
                {selectedOrg &&
                  selectedOrgTemplates &&
                  selectedOrgTemplates.map((el) => (
                    <label key={el.id} className={`${styles.element_organisme} ${styles.label_sous_title}`}>
                      <input type="radio" id={el.id} name="contact" onClick={() => setSelectedTemplate(el.id)} />
                      {/* <label htmlFor={el.id}>{el.title}</label> */}
                      <div className={styles.list_element}>{el.title}</div>
                    </label>
                  ))}
              </div>
            </div>
          }
        </div>
        <div className="form-check">
          <input 
           className="form-check-input"
           type="radio"
           name="flexRadioDefault"
           id="flexRadioDefault4"
           onClick={() => handleCheckOption("funder")} />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault4">
            {t('Funder')}
          </label>
          { isShownFunder &&
            <div className={styles.select}>
              {fundersList && (
                <CustomSelect
                  options={fundersList}
                  onChange={handleSelectFunder}
                  selectedOption={{
                    label: selectedFunder.name,
                    value: selectedFunder.id,
                  }}
                />
              )}

              <div className={styles.list_organisme}>
                {selectedFunder &&
                  selectedFunderTemplates &&
                  selectedFunderTemplates.map((el) => (
                    <label key={el.id} className={`${styles.element_organisme} ${styles.label_sous_title}`}>
                      <input type="radio" id={el.id} name="contact" onClick={() => setSelectedTemplate(el.id)} />
                      {/* <label htmlFor={el.id}>{el.title}</label> */}
                      <div className={styles.list_element}>{el.title}</div>
                    </label>
                  ))}
              </div>
            </div>
          }
        </div>
      </div>
      <div className="row">
        {/* <button type="button" className="btn btn-primary validate" onClick={handleSendTemplateId}>
          Valider mon choix
        </button> */}
        <CustomButton handleClick={handleSendTemplateId} title={t("Confirm my choice")} position="start"></CustomButton>
      </div>
    </div>
  );
}

export default SecondStep;
