import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import MappingPropertiesForm from "../TemplateMappingComponents/MappingPropertiesForm";
import Mapper from "../TemplateMappingComponents/Mapper";
import CustomButton from "../Styled/CustomButton";
import CustomSpinner from "../Shared/CustomSpinner";
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
    mappingType, setMappingType,
    templateMappingName,
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

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h1 style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <a href="/super_admin/template_mappings"
                className="btn btn-primary pull-left">{t('← All Mappings')}</a>
            </div>
            <span>{(templateMappingId ? `${t('Edit Mapping')} ${templateMappingId}` : t('Create Mapping'))}</span>
            <div>
              <div style={{ visibility: templateMappingId ? 'visible' : 'hidden' }}>
                <CustomButton
                  title="💾 Save mapping"
                  handleClick={saveMapping}
                  buttonColor="orange"
                />
              </div>
            </div>
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
            {!templateMappingId &&
              <CustomButton
                title="+ Create Mapping"
                handleClick={saveMapping}
                buttonColor="orange"
              />
            }
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
                handleClick={deleteMapping}
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
