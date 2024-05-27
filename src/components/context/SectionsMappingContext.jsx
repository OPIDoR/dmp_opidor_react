import React, { createContext, useState, useEffect, useRef } from 'react';
import useTemplate from '../../hooks/useTemplate';

export const SectionsMappingContext = createContext();

export const SectionsMappingProvider = ({ children }) => {
  // --- STATE ---
  const USAGE_INITIAL = 'initial';
  const USAGE_TARGET = 'target';
  const DEFAULT_REF = useRef(null);

  const [mapping, setMapping] = useState(false);
  const enableMapping = () => setMapping(true);

  const [editorRef, setEditorRef] = useState(DEFAULT_REF);
  
  const [forms, setForms] = useState({}); // Associate a form id to its structure and content display mode
  const setIsStructuredModel = (id, value) => updateForm(id, 'structured', value);
  const setIsHiddenQuestionsFields = (id, value) => updateForm(id, 'hiddenQuestionsFields', value);
  const setUsage = (id, value) => updateForm(id, 'usage', value);

  const updateForm = (id, key, value) => setForms(prev => ({
    ...prev,
    [id]: {
      ...prev[id],
      [key]: value
    }
  }));

  const [initialTemplateId, setInitialTemplateId] = useState(5);
  const [targetTemplateId, setTargetTemplateId] = useState(1);
  const [mappingSchema, setMappingSchema] = useState({});
  const { fetchAndProcessSectionsData } = useTemplate();

  useEffect(() => {
    buildMappingSchema();

    async function buildMappingSchema() {
      const innerMappingSchema = await buildMappingInnerSchema(targetTemplateId);
      const schema = {
        initialTemplateId,
        targetTemplateId,
        mapping: innerMappingSchema,
        // mapping: {
        //   "16": {
        //     "29": "<p>Ceci est une description tr&egrave;s int&eacute;ressante de mon projet.</p><p>Son titre est le suivant : <samp>$.researchOutputDescription.title</samp></p><p>Il est financ&eacute; par l'ANR.</p>"
        //   },
        //   "17": {
        //     "30": "<p>Ceci est une description tr&egrave;s int&eacute;ressante de mon projet.</p><p>Son titre est le suivant : <samp>$.researchOutputDescription.title</samp></p><p>Il est financ&eacute; par l'ANR.</p>"
        //   }
        // }
      };
      setMappingSchema(schema);

      console.log('Mapping schema:', schema);
    }
  }, [initialTemplateId, targetTemplateId]);

  const buildMappingInnerSchema = async (templateId) => {
    const mapping = {};

    const res = await fetchAndProcessSectionsData(templateId);

    res.data.sections.forEach(section => {
      section.questions.forEach(question => {
        mapping[section.id] = {
          ...mapping[section.id],
          [question.id]: ""
        };
      });
    });

    // console.log('Mapping inner schema:', mapping);

    return mapping;
  }

  // --- BEHAVIOURS ---
  const buildJsonPath = (jsonPath, key, type) => {
    const jpKey = type === 'array'
      ? `${key}[*]`
      : key;

    const currentJsonPath = jsonPath
      ? `${jsonPath}.${jpKey}`
      : `$.${key}`;

    return currentJsonPath;
  }

  useEffect(() => {
    console.log('Forms updated:', forms);
  }, [forms]);

  // --- RENDER ---
  return (
    <SectionsMappingContext.Provider
      value={{
        mapping, setMapping, enableMapping,
        editorRef, setEditorRef,
        buildJsonPath,
        forms, setIsStructuredModel, setIsHiddenQuestionsFields, setUsage,
        USAGE_INITIAL, USAGE_TARGET,
        DEFAULT_REF,
        initialTemplateId, setInitialTemplateId,
        targetTemplateId, setTargetTemplateId,
        mappingSchema, setMappingSchema
      }}
    >
      {children}
    </SectionsMappingContext.Provider>
  );
};
