import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { writePlan, researchOutput } from '../../services';
import CustomSpinner from '../Shared/CustomSpinner';
import { GlobalContext } from '../context/Global';
import CustomError from '../Shared/CustomError';
import Section from './Section';
import ResearchOutputModal from '../ResearchOutput/ResearchOutputModal';
import ResearchOutputInfobox from '../ResearchOutput/ResearchOutputInfobox';
import styles from '../assets/css/write_plan.module.css';

function SectionsContent({ planId, templateId, readonly }) {
  const { t } = useTranslation();
  const {
    openedQuestions,
    setOpenedQuestions,
    setResearchOutputs,
    displayedResearchOutput, setDisplayedResearchOutput,
    setPlanInformations,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);

  useEffect(() => {
    setLoading(true);
    writePlan.getSectionsData(templateId)
      .then((res) => {
        setPlanInformations({
          locale: res?.data?.locale.split('-')?.at(0) || 'fr',
          title: res?.data?.title,
          version: res?.data?.version,
          org: res?.data?.org,
          publishedDate: res?.data?.publishedDate,
        });

        // const researchOutputFilter = res.data.plan.research_outputs.filter((el) => {
        //   return el.id === displayedResearchOutput.id;
        // });
        setSectionsData(res.data);
        if (!openedQuestions || !openedQuestions[displayedResearchOutput.id]) {
          // const allCollapses = res.data.map((section) => {
          //   return {[section.id]: []};
          // });
          const updatedCollapseState = {
            ...openedQuestions,
            [displayedResearchOutput.id]: {},
          };
          setOpenedQuestions(updatedCollapseState);
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [templateId]);

  /**
   * The function handles the deletion of a product from a research output and
   * displays a confirmation message using the SweetAlert library.
   */
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t('Do you confirm the deletion'),
      text: t('By deleting this search product, the associated answers will also be deleted'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: t('Close'),
      confirmButtonText: t('Yes, delete!'),
    }).then((result) => {
      if (result.isConfirmed) {
        researchOutput.deleteResearchOutput(displayedResearchOutput.id, planId).then((res) => {
          setResearchOutputs(res.data.research_outputs);
          setDisplayedResearchOutput(res.data.research_outputs[0]);
          toast.success(t('Research output was successfully deleted.'));
        }).catch((err) => setError(err));
      }
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(true);
    setEdit(true);
  };

  const handleClose = () => {
    setShow(false);
    setEdit(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {show && (
        <ResearchOutputModal
          planId={planId}
          handleClose={handleClose}
          show={show}
          edit={edit}
        />
      )}
      {loading && <CustomSpinner isOverlay />}
      {error && <CustomError error={error} />}
      {!error && sectionsData?.sections && (
        <div className={styles.write_plan_block} id="sections-content">
          <ResearchOutputInfobox
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            readonly={readonly}
          />
          {sectionsData?.sections?.map((section) => (
            <Section
              key={section.id}
              section={section}
              readonly={readonly}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SectionsContent;
