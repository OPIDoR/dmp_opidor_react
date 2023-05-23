import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";

import { getDefaultModel, getFunder, getFunderById, getOrganisme, getOtherOrganisme, getOtherOrganismeById } from "../../services/DmpPlansApi";
import { GlobalContext } from "../context/Global";
import Swal from "sweetalert2";
import styles from "../assets/css/steps.module.css";
import CustomButton from "../Styled/CustomButton";
import CircleTitle from "../Styled/CircleTitle";

/* The above code is a React functional component that renders a form with radio buttons to select a template for a document. It fetches data from APIs
using useEffect hooks and uses react-select library to create dropdown menus. It also has functions to handle the selection of options and to send the
selected template ID to the next step. */
function SecondStep() {
  const { t } = useTranslation();
  const { researchContext, setResearchContext } = useContext(GlobalContext);
  const [defaultModel, setDefaultModel] = useState(null);
  const [defaultId, setDefaultId] = useState(null);
  const [otherOrg, setOtherOrg] = useState(null);
  const [listFunder, setlistFunder] = useState(null);
  const [listOrg, setListOrg] = useState(null);
  const [isShowListOrg, setIsShowListOrg] = useState(false);
  const [isShowOrg, setIsShowOrg] = useState(false);
  const [isShowFunder, setIsShowFunder] = useState(false);
  const [funders, setFunders] = useState(null);
  const [orgs, setOrgs] = useState(null);
  const [valueOtherOrg, setValueOtherOrg] = useState(t('Begin typing to see a list of suggestions.'));
  const [valueFunder, setValueFunder] = useState(t('Begin typing to see a list of suggestions.'));
  const [isShowOtherOrg, setIsShowOtherOrg] = useState(false);
  const [isShowListFunder, setIsShowListFunder] = useState(false);

  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    getOrganisme().then((res) => {
      setListOrg(res.data.templates);
    });
  }, [researchContext]);

  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    getDefaultModel().then((res) => {
      setDefaultModel(res.data);
      setResearchContext({ ...researchContext, template_id: res.data.id });
      setDefaultId(res.data.id);
    });
  }, []);

  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    getOtherOrganisme().then((res) => {
      const options = res.data.map((option) => ({
        value: option.id,
        label: option.sort_name,
        object: option,
      }));
      setOtherOrg(options);
    });
  }, []);

  /* A hook that is called when the component is mounted. It is used to fetch data from an API. */
  useEffect(() => {
    getFunder().then((res) => {
      const options = res.data.map((option) => ({
        value: option.id,
        label: option.sort_name,
        object: option,
      }));
      setlistFunder(options);
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
      case "1":
        //state
        setResearchContext({ ...researchContext, ["template_id"]: defaultId });
        //
        setIsShowListOrg(false);
        setIsShowOrg(false);

        //condition 3
        setOrgs(null);
        setIsShowFunder(false);
        setValueFunder(t('Begin typing to see a list of suggestions.'));
        setIsShowOtherOrg(true);
        setIsShowListFunder(false);

        //condition 4
        setValueOtherOrg(t('Begin typing to see a list of suggestions.'));
        setIsShowListFunder(false);
        setIsShowOtherOrg(false);

        break;
      case "2":
        //state
        setResearchContext({ ...researchContext, ["template_id"]: null });
        //
        setIsShowListOrg(true);
        setIsShowOrg(false);
        //condition 3
        setOrgs(null);
        setIsShowFunder(false);
        setValueFunder(t('Begin typing to see a list of suggestions.'));
        setIsShowOtherOrg(true);
        setIsShowListFunder(false);
        //condition 4
        setValueOtherOrg(t('Begin typing to see a list of suggestions.'));
        setIsShowListFunder(false);
        setIsShowOtherOrg(false);
        break;
      case "3":
        //state
        setResearchContext({ ...researchContext, ["template_id"]: null });
        //
        setIsShowListOrg(false);
        setIsShowOrg(false);
        //condition 3
        setOrgs(null);
        setIsShowFunder(false);
        setValueFunder(t('Begin typing to see a list of suggestions.'));
        setIsShowOtherOrg(true);
        setIsShowListFunder(false);
        break;
      default:
        //state
        setResearchContext({ ...researchContext, ["template_id"]: null });
        //
        setIsShowListOrg(false);
        setIsShowOrg(false);
        //condition 4
        setValueOtherOrg(t('Begin typing to see a list of suggestions.'));
        setIsShowListFunder(true);
        setIsShowOtherOrg(false);
        break;
    }
  };

  /**
   * I want to make an API call to get some data. I
   * want to set the state of the component to the data I get from the API call.
   * I'm using the react-select library to create a dropdown menu.
   */
  const handleChangeOtherOrganisme = (e) => {
    getOtherOrganismeById("", e.object, researchContext).then((res) => {
      setOrgs(res.data.templates);
      setIsShowOrg(true);
      setValueOtherOrg(e.label);
    });
  };

  /**
   * I'm trying to get the value of the selected option from the d
   * ropdown and pass it to the function getFunderById.
   */
  const handleChangeFunder = (e) => {
    getFunderById("", e.object, researchContext).then((res) => {
      setFunders(res.data.templates);
      setIsShowFunder(true);
      setValueFunder(e.label);
    });
  };

  /**
   * The function checks if a template ID exists in a context object and logs it, or displays an error message if it doesn't exist.
   */
  const handleSendTemplateId = () => {
    if (!researchContext["template_id"]) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: t("You must choose a model"),
      });
    }
  };

  return (
    <div>
      <CircleTitle number="2" title="Choisissez votre modèle"></CircleTitle>
      <div className="column">
        <div className="form-check">
          <input
            className={`form-check-label ${styles.check}`}
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            defaultChecked
            onClick={() => handleCheckOption("1")}
          />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault1">
            Modèle par défaut
          </label>
          <div className={styles.list_context}>{defaultModel && defaultModel?.title}</div>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => handleCheckOption("2")} />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault2">
            INRAE (votre organisme)
          </label>

          <div className={styles.list_organisme}>
            {isShowListOrg &&
              listOrg &&
              listOrg.map((el) => (
                <label key={el.id} className={`${styles.element_organisme} ${styles.label_sous_title}`}>
                  <input type="radio" id={el.id} name="contact" onClick={() => setResearchContext({ ...researchContext, ["template_id"]: el.id })} />
                  {/* <label htmlFor={el.id}>{el.title}</label> */}
                  <div className={styles.list_element}>{el.title}</div>
                </label>
              ))}
          </div>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" onClick={() => handleCheckOption("3")} />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault3">
            Autre organisme
          </label>
          <div className={styles.select}>
            {isShowOtherOrg && otherOrg && (
              <Select
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                options={otherOrg}
                onChange={handleChangeOtherOrganisme}
                value={{
                  label: valueOtherOrg,
                  value: valueOtherOrg,
                }}
              />
            )}
            <div className={styles.list_organisme}>
              {isShowOrg &&
                orgs &&
                orgs.map((el) => (
                  <label key={el.id} className={`${styles.element_organisme} ${styles.label_sous_title}`}>
                    <input type="radio" id={el.id} name="contact" onClick={() => setResearchContext({ ...researchContext, ["template_id"]: el.id })} />
                    {/* <label htmlFor={el.id}>{el.title}</label> */}
                    <div className={styles.list_element}>{el.title}</div>
                  </label>
                ))}
            </div>
          </div>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4" onClick={() => handleCheckOption("4")} />
          <label className={`form-check-label ${styles.label_title}`} htmlFor="flexRadioDefault4">
            Financeur
          </label>
          <div className={styles.select}>
            {isShowListFunder && listFunder && (
              <Select
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                options={listFunder}
                onChange={handleChangeFunder}
                value={{
                  label: valueFunder,
                  value: valueFunder,
                }}
              />
            )}

            <div className={styles.list_organisme}>
              {isShowFunder &&
                funders &&
                funders.map((el) => (
                  <label key={el.id} className={`${styles.element_organisme} ${styles.label_sous_title}`}>
                    <input type="radio" id={el.id} name="contact" onClick={() => setResearchContext({ ...researchContext, ["template_id"]: el.id })} />
                    {/* <label htmlFor={el.id}>{el.title}</label> */}
                    <div className={styles.list_element}>{el.title}</div>
                  </label>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {/* <button type="button" className="btn btn-primary validate" onClick={handleSendTemplateId}>
          Valider mon choix
        </button> */}
        <CustomButton handleClick={handleSendTemplateId} title="Valider mon choix" position="start"></CustomButton>
      </div>
    </div>
  );
}

export default SecondStep;
