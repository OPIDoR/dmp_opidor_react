import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { planCreation } from "../../services";
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
    planCreation.getTemplatesByOrgId(currentOrg, researchContext).then((res) => {
      setMyOrgTemplatesList(res.data);
    }).catch((error) => {
      toast.error(t("An error occurred during recovery of the organism template"));
    });
  }, [currentOrg, researchContext]);

  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    planCreation.getDefaultTemplate().then((res) => {
      setDefaultTemplate(res.data);
      setResearchContext(researchContext);
      setDefaultTemplateId(res.data.id);
      setSelectedTemplate(res.data.id);
    }).catch((error) => t("An error occurred while retrieving the default template"));
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
    planCreation.getOrgs(researchContext).then((res) => {
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
  const handleFetchFunders = async () => {
    let response;
    try {
      response = await planCreation.getFunders(researchContext);
    } catch (error) {
      return t("A mistake was made during the recovery of the funders");
    }

    const options = response.data.map((option) => ({
      value: option.id,
      label: option.name,
      object: option,
    }));
    setFundersList(options);
  };

  /**
   * I want to make an API call to get some data. I
   * want to set the state of the component to the data I get from the API call.
   * I'm using the react-select library to create a dropdown menu.
   */
  const handleSelectOrg = (e) => {
    const orgData = e.object;
    planCreation.getTemplatesByOrgId(orgData, researchContext).then((res) => {
      setSelectedOrg(orgData);
      setSelectedOrgTemplates(res.data);
    }).catch((error) => {
      toast.error(t("An error occurred during the recovery of the organism templates"));
    });
  };

  /**
   * I'm trying to get the value of the selected option from the d
   * ropdown and pass it to the function getFunderById.
   */
  const handleSelectFunder = async (e) => {
    const funderData = e.object;

    let response;
    try {
      response = await planCreation.getTemplatesByFunderId(funderData, researchContext);
    } catch(error) {
      return t("A mistake was made when retrieving the funders templates");
    }

    setSelectedFunder(funderData);
    setSelectedFunderTemplates(response.data);
  };

  /**
   * The function checks if a template ID exists in a context object and logs it, or displays an error message if it doesn't exist.
   */
  const handleSendTemplateId = async () => {
    if (!selectedTemplate) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t("You must choose a template"),
      });
    }

    let response;
    try {
      response = await planCreation.createPlan(selectedTemplate);
    } catch (error) {
      let errorMessage = t("An error occurred while creating the plan");

      if (error.response) {
        errorMessage = error.response.message;
      } else if (error.request) {
        errorMessage = error.request;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }

    window.location = `/plans/${response.data.id}`
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
