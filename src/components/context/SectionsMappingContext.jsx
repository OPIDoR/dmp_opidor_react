import React, { createContext, useState, useEffect, useRef } from 'react';
import useTemplate from '../../hooks/useTemplate';

export const SectionsMappingContext = createContext();

export const SectionsMappingProvider = ({ children }) => {

  const USAGE_INITIAL = 'initial';
  const USAGE_TARGET = 'target';

  const [mapping, setMapping] = useState(false);
  const enableMapping = () => setMapping(true);

  // --- Editor logic ---
  const DEFAULT_REF = useRef(null);
  const [editorRef, setEditorRef] = useState(DEFAULT_REF);
  const [handleInsert, setHandleInsert] = useState(() => () => {});
  // --- End Editor logic ---
  
  // --- Forms properties logic ---
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
  // --- End Forms properties logic ---

  // --- Mapping schema logic ---
  const [initialTemplateId, setInitialTemplateId] = useState(5);
  const [targetTemplateId, setTargetTemplateId] = useState(1);
  const [mappingSchema, setMappingSchema] = useState({});
  const { fetchAndProcessSectionsData } = useTemplate();

  useEffect(() => {
    if (!mapping) return;
    
    buildMappingSchema();

    async function buildMappingSchema() {
      const innerMappingSchema = await buildMappingInnerSchema(targetTemplateId);
      const schema = {
        initialTemplateId,
        targetTemplateId,
        mapping: innerMappingSchema,
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
        mapping[question.id] = ""
      });
    });

    return mapping;
  }

  // --- End Mapping schema logic ---

  // --- JSON path logic ---
  const buildJsonPath = (jsonPath, key, type) => {
    const jpKey = type === 'array'
      ? `${key}[*]`
      : key;

    const currentJsonPath = jsonPath
      ? `${jsonPath}.${jpKey}`
      : `$.${key}`;

    return currentJsonPath;
  }
  // --- End JSON path logic ---

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
        mappingSchema, setMappingSchema,
        handleInsert, setHandleInsert,
        insertInMappingSchema,
      }}
    >
      {children}
    </SectionsMappingContext.Provider>
  );
};
