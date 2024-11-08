import React, { useContext, useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

import { useTranslation } from 'react-i18next';
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";
import { toast } from "react-hot-toast";

import * as styles from "../assets/css/general_info.module.css";
import { GlobalContext } from '../context/Global';
import { generalInfo } from '../../services';
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import CustomSelect from "../Shared/CustomSelect";
import { service } from "../../services";
import { filterOptions } from "../../utils/GeneratorUtils";
import { getErrorMessage } from "../../utils/utils";


function FunderImport({ projectFragmentId, metaFragmentId, researchContext, locale }) {
  const { t } = useTranslation();
  const { setFormData, setPersons } = useContext(GlobalContext);
  const [isOpenFunderImport, setIsOpenFunderImport] = useState(false);
  const [funders, setFunders] = useState([]);
  const [selectedFunder, setSelectedFunder] = useState(null);
  const [fundedProjects, setFundedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  /* This `useEffect` hook is fetching data for funding organizations and setting the options for a `Select` component. It runs only once when the
  component mounts, as the dependency array `[]` is empty. */
  useEffect(() => {
    service.getRegistryByName('FundersWithImport').then(({ data }) => {
      const options = data.map((funder) => ({
        value: funder.id,
        label: funder.label[locale],
        scriptName: funder.scriptName,
        registry: funder.registry,
      }));
      setFunders(options);
    });
  }, []);

  /**
   * The function logs the value of an event and sets a grant ID to "ProjectStandard".
   */
  const handleSelectFunder = (e) => {
    setSelectedFunder(e);
    setSelectedProject(null);

    if (researchContext !== 'research_project') {
      return;
    }

    setLoading(true);
    return service.getRegistryByName(e.registry)
      .then((res) => {
        const options = res.data.map((option) => ({
          value: option.value,
          label: option.label[locale],
          object: { grantId: option.value, title: option.label[locale] }
        }));
        setFundedProjects(options);
      })
      .catch((error) => toast.error(t('An error occurred')))
      .finally(() => setLoading(false));
  };

  /**
   * The function `handleSaveFunder` saves a funder for a project fragment and sets the grant ID to "ProjectStandard".
   */
  const handleSaveFunding = async () => {
    setLoading(true);

    let response;
    try {
      response = await generalInfo.importProject(selectedProject.grantId, projectFragmentId, selectedFunder.scriptName);
    } catch (error) {
      let errorMessage = getErrorMessage(error) || t('An error occurred during the import of the project information');
      return toast.error(errorMessage);
    }

    setFormData({
      [projectFragmentId]: response.data.fragment.project,
      [metaFragmentId]: response.data.fragment.meta
    });
    setPersons(response.data.persons);
    if (response?.data?.meta_fragment) {
      document.getElementById('plan-title').innerHTML = response?.data?.meta_fragment?.data?.title;
      setFormData({ [response?.data?.meta_fragment?.id]: response.data.meta_fragment.data });
    }
    toast.success(t(
      '\'{{projectTitle}}\' project data has successfully been imported',
      { projectTitle: selectedProject.title }
    ), { style: { maxWidth: 500 } });

    setLoading(false);
  };

  return (
    <Card
      className={styles.card}
      style={{
        border: "2px solid var(--dark-blue)",
        borderRadius: "10px",
      }}>
      {loading && <CustomSpinner isOverlay={true} />}
      {error && <CustomError error={error} />}
      <Card.Header className="funder-import" style={{ background: "var(--dark-blue)", borderBottom: "none" }}>
        <Button
          style={{ backgroundColor: 'var(--dark-blue)', width: '100%', border: 'none' }}
          onClick={() => setIsOpenFunderImport(!isOpenFunderImport)}
          aria-controls="funder-import-collapse"
          aria-expanded={isOpenFunderImport}
        >
          <Card.Title>
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
          </Card.Title>
        </Button>
      </Card.Header>
      <Collapse in={isOpenFunderImport}>
        <div id="funder-import-collapse">
          <Card.Body className={styles.card_body} style={{ background: "var(--dark-blue)", borderRadius: "0px 0px 10px 10px" }}>
            {!error && funders && (
              <div className={styles.container_anr}>
                <p className={styles.description_anr}>{t('If your project is financed by one of the funders on the list, you can automatically retrieve the administrative information you entered when applying for a grant.')}</p>
                {funders.length > 1 && (
                  <div>
                    <div className={styles.label_form_anr}>
                      <label className={styles.label_anr}>{t("Please select a funder")}</label>
                    </div>
                    <CustomSelect
                      options={funders}
                      selectedOption={selectedFunder || null}
                      onSelectChange={(e) => handleSelectFunder(e)}
                    />
                  </div>
                )}
                {fundedProjects.length > 0 && (
                  <div style={{ paddingBottom: '10px' }}>
                    <div className={styles.label_form_anr}>
                      <label className={styles.label_anr}>{t("Then Select project acronym, title or ID")}</label>
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
                  <Button variant="light" onClick={handleSaveFunding}>{t("Save")}</Button>
                )}
              </div>
            )}
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  )

}

export default FunderImport;
