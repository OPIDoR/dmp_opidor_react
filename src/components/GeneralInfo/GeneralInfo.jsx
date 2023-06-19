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
import styles from "../assets/css/info.module.css";
import { getFunders, saveFunder, saveIsTestPlan } from "../../services/DmpGeneralInfoApi";
import { GlobalContext } from "../context/Global";
import DynamicForm from "../Builder/DynamicForm";
import { getRegistryByName } from "../../services/DmpServiceApi";

export const ButtonSave = styled.button`+
  margin: 10px 2px 2px 0px;
  color: #000;
  font-size: 18px;
  color: var(--primary) !important;
  font-family: custumHelveticaLight !important;
  border-radius: 8px !important;
`;

function GeneralInfo({ planId, dmpId, projectFragmentId, metaFragmentId, locale = 'en_GB', isTest = true }) {
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

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));

    setDmpId(dmpId);
  }, [dmpId, locale])

  /* This `useEffect` hook is fetching data for funding organizations and setting the options for a `Select` component. It runs only once when the
  component mounts, as the dependency array `[]` is empty. */
  useEffect(() => {
    getFunders().then((res) => {
      const options = res.data.map((option) => ({
        value: option.id,
        label: option.name,
      }));
      setFunders(options);
    });
  }, []);

  /* This `useEffect` hook is fetching data for funded projects and setting the options for a `Select` component. It runs only once when the component
  mounts, as the dependency array `[]` is empty. It sets the loading state to `true` before making the API call, and then sets it to `false` after the
  API call is completed, regardless of whether it was successful or not. If there is an error during the API call, it sets the error state to the error
  object. */
  useEffect(() => {
    setLoading(true);
    getRegistryByName('ANRProjects')
      .then((res) => {
        const options = res.data.map((option) => ({
          value: option.value,
          label: option.label[locale],
          object: {grantId: option.value, title: option.label[locale]}
        }));
        setFundedProjects(options);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [locale]);

  const handleClickIsTestPlan = (e) => {
    const checked = e.target.checked;
    saveIsTestPlan(planId, checked === true ? '1' : '0')
      .then((res) => {
        toast.success(res.data.msg);
      }).catch((res) => {
        toast.error(res.error);
      })
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
  const handleSaveFunding = () => {
    saveFunder(selectedProject.grantId, projectFragmentId).then((res) => {
      setLoading(true);
      setFormData({ [projectFragmentId]: res.data.fragment });
    }).catch((res) => {
      toast.error(res.error);
    }).finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <Panel
        expanded={isOpenFunderImport}
        className={styles.panel}
        style={{
          border: "2px solid var(--primary)",
          borderRadius: "11px",
          boxShadow: "10px 12px 8px #e5e4e7",
        }}
        onToggle={() => setIsOpenFunderImport(!isOpenFunderImport)}
      >
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError></CustomError>}
      {!error && funders && (
        <>
          <Panel.Heading className="funder-import "style={{ background: "var(--primary)", borderRadius: "8px 8px 0px 0px" }}>
            <Panel.Title toggle>
              <div className={styles.question_title}>
                <div className={styles.question_text}>
                  <div className={styles.title_anr}>{t("Click here if you have a funded project")}</div>
                </div>
                <span className={styles.question_icons}>
                  {isOpenFunderImport ? (
                    <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon_anr} />
                  ) : (
                    <TfiAngleRight style={{ minWidth: "35px" }} size={35} className={styles.down_icon_anr}/>
                  )}
                </span>
              </div>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible style={{ background: "var(--primary)", borderRadius: "0px 0px 8px 8px" }}>
            <div className={styles.container_anr}>
              <p className={styles.description_anr}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat tellus, pharetra sed ipsum ac, ornare lacinia leo. Curabitur
                rutrum commodo nibh eget ultricies. Aliquam viverra consequat nulla ac vehicula. Etiam porta scelerisque massa in faucibus. Donec
                ac porta tellus. Praesent pulvinar tristique metus vulputate interdum.
              </p>
              {funders.length > 1 && (
                <div className="form-group">
                  <div className={styles.label_form_anr}>
                    <label className={styles.label_anr}>{t("Please select your funding organization")}</label>
                  </div>
                  <CustomSelect
                    options={funders}
                    onChange={(e) => handleSelectFunder(e)}
                  />
                </div>
              )}
              {fundedProjects.length > 0 && (
                <div className="form-group">
                  <div className={styles.label_form_anr}>
                    <label className={styles.label_anr}>{t("Select project acronym, title or ID")}</label>
                    <BiInfoCircle size={25} color="white" style={{ marginLeft: "10px" }}></BiInfoCircle>
                  </div>
                    <CustomSelect
                      options={fundedProjects}
                      selectedOption={selectedProject ? {value: selectedProject.grantId, label: selectedProject.title } : null}
                      onChange={(e) => setSelectedProject(e.object)}
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
      <Panel 
        expanded={isOpenProjectForm}
        className={styles.panel}
        style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}
        onToggle={() => setIsOpenProjectForm(!isOpenProjectForm)}>
        <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
          <Panel.Title toggle>
            <div className={styles.question_title}>
              <div className={styles.question_text}>
                <div className={styles.title}>{t("Project Information")}</div>
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
          {projectFragmentId && <DynamicForm fragmentId={projectFragmentId} />}
        </Panel.Body>
      </Panel>
      <Panel 
        expanded={isOpenMetaForm}
        className={styles.panel}
        style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}
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
          <div className="container" style={{ display: "flex", justifyContent: "end", margin: "20px 0px 0px -110px " }}>
            <div className="form-check form-switch">
              <input
                type="checkbox"
                id="is_test"
                checked={isTestPlan}
                onClick={() => setIsTestPlan(!isTestPlan)}
                onChange={(e) => handleClickIsTestPlan(e)}
              />
              <label className="form-check-label" htmlFor="is_test">
                Plan de test
              </label>
            </div>
          </div>
          {metaFragmentId && <DynamicForm fragmentId={metaFragmentId} />}
        </Panel.Body>
      </Panel>
    </div>
  );
}

export default GeneralInfo;
