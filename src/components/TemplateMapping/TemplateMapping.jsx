import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import MappingPropertiesForm from "../TemplateMappingComponents/MappingPropertiesForm";
import Mapper from "../TemplateMappingComponents/Mapper";
import CustomButton from "../Styled/CustomButton";
import CustomSpinner from "../Shared/CustomSpinner";
import Swal from "sweetalert2";
import { t } from "i18next";

function TemplateMapping({ data, locale, mappingId }) {
  // --- STATE ---
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const {
    enableMapping,
    initialTemplateId,
    targetTemplateId,
    templateMappingId, setTemplateMappingId,
    saveMapping, deleteMapping,
    isLoading,
    mappingType, setMappingType
  } = useSectionsMapping();

  // --- EFFECTS ---
  useEffect(() => {
    enableMapping();
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));

    // setInitialTemplateId(5);
    // setTargetTemplateId(4);
    console.log(initialTemplateId, targetTemplateId);
  }, [locale]);

  useEffect(() => {
    setTemplateMappingId(mappingId);
  }, [mappingId]);

  const handleDeleteMapping = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMapping();
        Swal.fire(
          'Deleted!',
          'Your mapping has been deleted.',
          'success'
        )
      }
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h1>
            <a href="/super_admin/template_mappings"
              className="btn btn-primary pull-right">{t('View all mappings')}</a>
            {t(templateMappingId ? (`Edit Mapping ${templateMappingId}`) : 'New Mapping')}

          </h1>
        </div>
      </div>
      <p>Here you can map the sections of a structured template to the sections of a classic template.</p>
      {isLoading
        ? <CustomSpinner />
        : <>
          <MappingPropertiesForm
            data={data}
            mappingType={mappingType}
            setMappingType={setMappingType}
          />
          {templateMappingId && (
            <Mapper
              mappingType={mappingType}
            />
          )}
          <div style={{
            alignContent: "center",
            display: "flex",
            justifyContent: "center",
            marginTop: "20px"
          }}>
            <CustomButton
              title={templateMappingId ? "Save mapping" : "Create mapping"}
              handleClick={saveMapping}
              buttonColor="orange"
            />
          </div>
          {templateMappingId && (
            <div>
              <h3 style={{
                color: "red",
                marginTop: "20px",
                fontSize: "2rem",
                fontWeight: "bold",
              }}>Danger zone</h3>
              <CustomButton
                title="⚠ Delete mapping"
                handleClick={handleDeleteMapping}
                buttonColor="red"
              />
            </div>
          )}
        </>
      }
    </>
  );
}

export default TemplateMapping;
