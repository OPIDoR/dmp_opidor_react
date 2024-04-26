import React, { useState } from 'react';
import ResearchOutputInfobox from "./ResearchOutputInfobox";
import ResearchOutputModal from "./ResearchOutputModal";
import useSectionsMode, { MODE_MAPPING } from '../../hooks/useSectionsMode';

function ResearchOutput({planId, readonly}) {
    // --- STATE ---
    const { mode } = useSectionsMode();
    const [ show, setShow ] = useState(false);
    const [ edit, setEdit ] = useState(false);


    // --- BEHAVIOURS ---
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
            researchOutput.deleteResearchOutput(displayedResearchOutput.id, planId).then(({ data }) => {
            setResearchOutputs(data.research_outputs);

            const updatedOpenedQuestions = { ...openedQuestions };
            delete updatedOpenedQuestions[displayedResearchOutput.id];
            setOpenedQuestions(updatedOpenedQuestions);

            setDisplayedResearchOutput(data.research_outputs[0]);
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

    const handleClose = (e) => {
        setShow(false);
        setEdit(false);
    }

    // --- RENDER ---
    return (
        <>
            {show && <ResearchOutputModal planId={planId} handleClose={handleClose} show={show} edit={edit} />}
            {mode !== MODE_MAPPING && <ResearchOutputInfobox handleEdit={handleEdit} handleDelete={handleDelete} readonly={readonly}></ResearchOutputInfobox>}
        </>
    )
}

export default ResearchOutput;