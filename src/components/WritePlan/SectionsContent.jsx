import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { researchOutput } from "../../services";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import Section from "./Section";
import GuidanceChoice from "./GuidanceChoice";
import ResearchOutputModal from "../ResearchOutput/ResearchOutputModal";
import ResearchOutputInfobox from "../ResearchOutput/ResearchOutputInfobox";
import * as styles from "../assets/css/write_plan.module.css";
import consumer from "../../cable";

function SectionsContent({ planId, readonly }) {
  const { t } = useTranslation();
  const {
    setFormData,
    openedQuestions,
    setOpenedQuestions,
    setResearchOutputs,
    displayedResearchOutput, setDisplayedResearchOutput,
    setUrlParams,
  } = useContext(GlobalContext);
  const subscriptionRef = useRef(null);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(null);


  const handleWebsocketData = useCallback((data) => {
    if (data.target === 'research_output_infobox' && displayedResearchOutput.id === data.research_output_id) {
      setDisplayedResearchOutput({ ...displayedResearchOutput, ...data.payload })
    }
    if (data.target === 'dynamic_form') {
      setFormData({ [data.fragment_id]: data.payload })
    }
  }, [displayedResearchOutput, setDisplayedResearchOutput, setFormData])

  useEffect(() => {
    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    subscriptionRef.current = consumer.subscriptions.create({ channel: "PlanChannel", id: planId },
      {
        connected: () => console.log("connected!"),
        disconnected: () => console.log("disconnected !"),
        received: data => handleWebsocketData(data),
      });
    return () => {
      consumer.disconnect();
    }
  }, [planId, handleWebsocketData])

  useEffect(() => {
    if (!displayedResearchOutput) return;

    if (!openedQuestions || !openedQuestions[displayedResearchOutput.id]) {
      const updatedCollapseState = {
        ...openedQuestions,
        [displayedResearchOutput.id]: {},
      };
      setOpenedQuestions(updatedCollapseState);
    }

  }, [displayedResearchOutput])

  /**
   * The function handles the deletion of a product from a research output and displays a confirmation message using the SweetAlert library.
   */
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Do you confirm the deletion?"),
      text: t("By deleting this research output, the associated answers will also be deleted"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        //delete
        researchOutput.deleteResearchOutput(displayedResearchOutput.id).then(({ data }) => {
          setResearchOutputs(data.research_outputs);

          const updatedOpenedQuestions = { ...openedQuestions };
          delete updatedOpenedQuestions[displayedResearchOutput.id];
          setOpenedQuestions(updatedOpenedQuestions);

          setDisplayedResearchOutput(data.research_outputs.at(-1));
          setUrlParams({ research_output: data.research_outputs[0].id });
          toast.success(t("Research output was successfully deleted."));
        })
          .catch((error) => setError(error));
      }
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(true);
    setEdit(true);
  };

  const handleDuplicate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: t("Do you want to duplicate the search output?"),
      text: t("Remember to rename your search output after duplication."),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, duplicate!"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        researchOutput.importResearchOutput({ planId, uuid: displayedResearchOutput.uuid, duplicate: true }).then((res) => {
          const { research_outputs, created_ro_id } = res.data;
          setDisplayedResearchOutput(research_outputs.find(({ id }) => id === created_ro_id));
          setResearchOutputs(research_outputs);
          setUrlParams({ research_output: created_ro_id });

          toast.success(t("Research output successfully imported."));
        }).catch(() => {
          return toast.error(t('An error occured during import !'));
        });
      }
    });

  }

  const handleClose = () => {
    setShow(false);
    setEdit(false);
  }

  return (
    <div style={{ position: 'relative' }}>
      {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show} edit={edit} />}
      {error && <CustomError error={error}></CustomError>}
      {!error && displayedResearchOutput?.template?.sections && (
        <>
          <div className={styles.write_plan_block} id="sections-content">
            {!readonly &&
              <GuidanceChoice planId={planId} researchOutputId={displayedResearchOutput?.id} topic={displayedResearchOutput?.topic} style={{ flexGrow: 1 }} />
            }
            <ResearchOutputInfobox
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleDuplicate={handleDuplicate}
              readonly={readonly}
            />
            {displayedResearchOutput?.template?.sections?.map((section) => (
              <Section
                key={section.id}
                planId={planId}
                section={section}
                readonly={readonly}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SectionsContent;
