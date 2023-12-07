import React, { useState, useEffect, useContext } from "react";
import { Panel } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BiInfoCircle } from "react-icons/bi";
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";
import styled from "styled-components";
import { toast } from "react-hot-toast";

import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import CustomSelect from "../Shared/CustomSelect";
import styles from "../assets/css/general_info.module.css";
import { generalInfo } from "../../services";
import { GlobalContext } from "../context/Global";
import DynamicForm from "../Forms/DynamicForm";
import { service } from "../../services";
import { filterOptions } from "../../utils/GeneratorUtils";

export const ButtonSave = styled.button`+
  margin: 10px 2px 2px 0px;
  color: #000;
  font-size: 18px;
  color: var(--dark-blue) !important;
  font-family: "Helvetica Neue", sans-serif !important;
  border-radius: 8px !important;
`;

function GeneralInfo({
  planId,
  dmpId,
  projectFragmentId,
  metaFragmentId,
  locale = 'en_GB',
  researchContext = 'research_project',
  isTest = true,
  readonly,
}) {
  const { t, i18n } = useTranslation();
  const { setLocale, setDmpId, setFormData } = useContext(GlobalContext);

  const [isTestPlan, setIsTestPlan] = useState(isTest);

  const [isOpenFunderImport, setIsOpenFunderImport] = useState(false);
  const [funders, setFunders] = useState([]);
  const [fundedProjects, setFundedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isOpenProjectForm, setIsOpenProjectForm] = useState(true);

  const [isOpenMetaForm, setIsOpenMetaForm] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const projectFormLabel = researchContext === 'research_project' ? t("Project Details") : t("Research Entity Details");

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));

    setDmpId(dmpId);
  }, [dmpId, locale])

  /* This `useEffect` hook is fetching data for funding organizations and setting the options for a `Select` component. It runs only once when the
  component mounts, as the dependency array `[]` is empty. */
  useEffect(() => {
    generalInfo.getFunders().then(({ data }) => {
      const options = data.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setFunders(options);
    });
  }, []);

  /* This `useEffect` hook is fetching data for funded projects and setting the options for a `Select` component. It runs only once when the component
  mounts, as the dependency array `[]` is empty. It sets the loading state to `true` before making the API call, and then sets it to `false` after the
  API call is completed, regardless of whether it was successful or not. If there is an error during the API call, it sets the error state to the error
  object. */
  useEffect(() => {
    if (researchContext === 'research_project') {
      setLoading(true);
      service.getRegistryByName('ANRProjects')
        .then((res) => {
          const options = res.data.map((option) => ({
            value: option.value,
            label: option.label[locale],
            object: { grantId: option.value, title: option.label[locale] }
          }));
          setFundedProjects(options);
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [locale]);

  const handleClickIsTestPlan = async (e) => {
    const checked = e.target.checked;

    let response;
    try {
      response = await generalInfo.saveIsTestPlan(planId, checked === true ? '1' : '0');
    } catch (error) {
      let errorMessage = t("An error occurred during the change of status of the plan");

      if (error.response) {
        errorMessage = error.response.message;
      } else if (error.request) {
        errorMessage = error.request;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return toast.error(errorMessage);
    }

    return toast.success(response?.data?.msg);
  };

  /**
   * The function logs the value of an event and sets a grant ID to "ProjectStandard".
   */
  const handleSelectFunder = (e) => {
    console.log(e.value);
    //setGrantId("ProjectStandard");
  };

  /**
   * The function `handleSaveFunder` saves a funder for a project fragment and sets the grant ID to "ProjectStandard".
   */
  const handleSaveFunding = async () => {
    setLoading(true);

    let response;
    try {
      response = await generalInfo.saveFunder(selectedProject.grantId, projectFragmentId);
    } catch (error) {
      let errorMessage = t("An error occurred during the saving of the funders");

      if (error.response) {
        errorMessage = error.response.message;
      } else if (error.request) {
        errorMessage = error.request;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return toast.error(errorMessage);
    }

    setFormData({
      [projectFragmentId]: response.data.fragment.project,
      [metaFragmentId]: response.data.fragment.meta
    });
    if (response.data.plan_title) {
      document.getElementById('plan-title').innerHTML = response.data.plan_title;
    }
    toast.success(t(
      '\'{{projectTitle}}\' project data has successfully been imported',
      { projectTitle: selectedProject.title }
    ), { style: { maxWidth: 500 } });

    setLoading(false);
  };

  return (
    <>
      {!readonly && researchContext === 'research_project' && (
        <Panel
          expanded={isOpenFunderImport}
          className={styles.panel}
          style={{
            border: "2px solid var(--dark-blue)",
            borderRadius: "11px",
            boxShadow: "10px 12px 8px #e5e4e7",
          }}
          onToggle={() => setIsOpenFunderImport(!isOpenFunderImport)}
        >
          {loading && <CustomSpinner isOverlay={true} />}
          {error && <CustomError error={error} />}
          {!error && funders && (
            <>
              <Panel.Heading className="funder-import " style={{ background: "var(--dark-blue)", borderRadius: "8px 8px 0px 0px" }}>
                <Panel.Title toggle>
                  <div className={styles.question_title}>
                    <div className={styles.question_text}>
                      <div className={styles.title_anr}>{t("Click here if you have a funded project")}</div>
                    </div>
                    <span className={styles.question_icons}>
                      {isOpenFunderImport ? (
                        <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon_anr} />
                      ) : (
                        <TfiAngleRight style={{ minWidth: "35px" }} size={35} className={styles.down_icon_anr} />
                      )}
                    </span>
                  </div>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible style={{ background: "var(--dark-blue)", borderRadius: "0px 0px 8px 8px" }}>
                <div className={styles.container_anr}>
                  <p className={styles.description_anr}>{t('Your project is funded by the ANR, automatically retrieve the administrative information for your project.')}</p>
                  {funders.length > 1 && (
                    <div className="form-group">
                      <div className={styles.label_form_anr}>
                        <label className={styles.label_anr}>{t("Please select your funding organization")}</label>
                      </div>
                      <CustomSelect
                        options={funders}
                        onSelectChange={(e) => handleSelectFunder(e)}
                      />
                    </div>
                  )}
                  {fundedProjects.length > 0 && (
                    <div className="form-group">
                      <div className={styles.label_form_anr}>
                        <label className={styles.label_anr}>{t("Select project acronym, title or ID")}</label>
                      </div>
                      <CustomSelect
                        options={fundedProjects}
                        selectedOption={selectedProject ? { value: selectedProject.grantId, label: selectedProject.title } : null}
                        onSelectChange={(e) => setSelectedProject(e.object)}
                        async={true}
                        asyncCallback={(value) => filterOptions(fundedProjects, value)}
                      />
                    </div>
                  )}
                  {selectedProject && (
                    <ButtonSave className="btn btn-light" onClick={handleSaveFunding}>
                      {t("Save")}
                    </ButtonSave>
                  )}
                </div>
              </Panel.Body>
            </>
          )}
        </Panel>
      )}
      <Panel
        expanded={isOpenProjectForm}
        className={styles.panel}
        style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--dark-blue)" }}
        onToggle={() => setIsOpenProjectForm(!isOpenProjectForm)}>
        <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
          <Panel.Title toggle>
            <div className={styles.question_title}>
              <div className={styles.question_text}>
                <div className={styles.title}>{projectFormLabel}</div>
              </div>

              <span className={styles.question_icons}>
                {isOpenProjectForm ? (
                  <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                ) : (
                  <TfiAngleRight style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                )}
              </span>
            </div>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body className={styles.panel_body} collapsible={true}>
          {projectFragmentId && <DynamicForm fragmentId={projectFragmentId} readonly={readonly} />}
        </Panel.Body>
      </Panel>
      <Panel
        expanded={isOpenMetaForm}
        className={styles.panel}
        style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--dark-blue)" }}
        onToggle={() => setIsOpenMetaForm(!isOpenMetaForm)}>
        <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
          <Panel.Title toggle>
            <div className={styles.question_title}>
              <div className={styles.question_text}>
                <div className={styles.title}>{t("Plan Information")}</div>
              </div>

              <span className={styles.question_icons}>
                {isOpenMetaForm ? (
                  <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                ) : (
                  <TfiAngleRight style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                )}
              </span>
            </div>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body className={styles.panel_body} collapsible={true}>
          <div className="form-check form-switch" style={{ marginLeft: '15px' }}>
            <input
              type="checkbox"
              id="is_test"
              checked={isTestPlan}
              onClick={() => setIsTestPlan(!isTestPlan)}
              onChange={(e) => handleClickIsTestPlan(e)}
              disabled={readonly}
              style={{ marginRight: '10px' }}
            />
            <label className="form-check-label" htmlFor="is_test">
              {t('Test Plan')}
            </label>
          </div>
          {metaFragmentId && <DynamicForm fragmentId={metaFragmentId} readonly={readonly} />}
        </Panel.Body>
      </Panel>
    </>
  );
}

export default GeneralInfo;
