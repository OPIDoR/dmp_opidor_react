import React, { useState, useEffect, useContext } from "react";
import { Panel } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";
import { toast } from "react-hot-toast";

import * as styles from "../assets/css/general_info.module.css";
import { generalInfo } from "../../services";
import { GlobalContext } from "../context/Global";
import DynamicForm from "../Forms/DynamicForm";
import FunderImport from "./FunderImport";
import { getErrorMessage } from "../../utils/utils";

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
  const { setLocale, setDmpId } = useContext(GlobalContext);

  const [isTestPlan, setIsTestPlan] = useState(isTest);

  const [isOpenProjectForm, setIsOpenProjectForm] = useState(true);

  const [isOpenMetaForm, setIsOpenMetaForm] = useState(true);

  const projectFormLabel = researchContext === 'research_project' ? t("Project Details") : t("Research Entity Details");

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));

    setDmpId(dmpId);
  }, [dmpId, locale])

  const handleClickIsTestPlan = async (e) => {
    const checked = e.target.checked;

    let response;
    try {
      response = await generalInfo.saveIsTestPlan(planId, checked === true ? '1' : '0');
    } catch (error) {
      let errorMessage = getErrorMessage(error) || t("An error occurred during the change of status of the plan");
      return toast.error(errorMessage);
    }

    return toast.success(response?.data?.msg);
  };
  
  return (
    <>
      {!readonly && researchContext === 'research_project' && (
        <FunderImport projectFragmentId={projectFragmentId} researchContext={researchContext} locale={locale}/>
      )}
      <Panel
        expanded={isOpenProjectForm}
        className={styles.panel}
        style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--dark-blue)" }}
        onToggle={(expanded) => setIsOpenProjectForm(expanded)}>
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
        onToggle={(expanded) => setIsOpenMetaForm(expanded)}>
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
              {t('Test Plan (e.g. as part of a training course)')}
            </label>
          </div>
          {metaFragmentId && <DynamicForm fragmentId={metaFragmentId} readonly={readonly} />}
        </Panel.Body>
      </Panel>
    </>
  );
}

export default GeneralInfo;
