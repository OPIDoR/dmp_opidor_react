import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import MappingPropertiesForm from "../TemplateMappingComponents/MappingPropertiesForm";
import Mapper from "../TemplateMappingComponents/Mapper";
import CustomButton from "../Styled/CustomButton";
import CustomSpinner from "../Shared/CustomSpinner";
import ContentHeading from "../Shared/ContentHeading";
import { t } from "i18next";
import CustomError from "../Shared/CustomError";
import { FaSave, FaTrashAlt, FaPlus } from "react-icons/fa";

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
    isLoading, isError,
    mappingType, setMappingType,
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

  if (isError) 
    return (
      // <p>{t('An error occurred while loading the mapping.')}</p>
      <CustomError 
        error={{
          message: t('Mapping not found'),
          error: t('This error occurred while loading the mapping'),
          home: false
        }}
        handleClose={() => window.location.href = '/super_admin/template_mappings'}
      />
    )

  return (
    <>
      <ContentHeading
        title={
          (templateMappingId ? `${t('Edit Mapping')} ${templateMappingId}` : t('Create Mapping'))
        }
        leftChildren={
          <a href="/super_admin/template_mappings" className="btn btn-primary pull-left">{t('← All Mappings')}</a>
        }
        rightChildren={
          <div style={{ visibility: templateMappingId ? 'visible' : 'hidden', display: 'flex' }}>
            <CustomButton
              title="Save mapping"
              icon={<FaSave />}
              handleClick={saveMapping}
              buttonColor="orange" 
            />
            &nbsp;
            <CustomButton
                icon={<FaTrashAlt />}
                handleClick={deleteMapping}
                buttonColor="red"
              />
          </div>
        }
      />
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
                icon={<FaPlus />}
                handleClick={saveMapping}
                buttonColor="orange"
              />
            }
          </div>
        </>
      }
    </>
  );
}

export default TemplateMapping;