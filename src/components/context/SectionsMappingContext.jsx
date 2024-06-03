import React, { createContext, useState, useEffect, useRef } from 'react';
import useTemplate from '../../hooks/useTemplate';
import axios from '../../utils/AxiosClient';

export const SectionsMappingContext = createContext();

export const SectionsMappingProvider = ({ children }) => {
  
  // --- Mapping logic ---
  const [mapping, setMapping] = useState(false);
  const enableMapping = () => setMapping(true);
  const [templateMappingId, setTemplateMappingId] = useState(null);
  // --- End Mapping logic ---

  // --- Editor logic ---
  const DEFAULT_REF = useRef(null);
  const [editorRef, setEditorRef] = useState(DEFAULT_REF);
  const [handleInsert, setHandleInsert] = useState(() => () => {});
  const [currentlyOpenedQuestion, setCurrentlyOpenedQuestion] = useState(null);
  // --- End Editor logic ---
  
  // --- Forms properties logic ---
  const USAGE_INITIAL = 'initial';
  const USAGE_TARGET = 'target';
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
  const [mappingSchema, setMappingSchema] = useState({mapping: {}});
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

  const insertInMappingSchema = (value) => {
    setMappingSchema(prev => ({
      ...prev,
      mapping: {
        ...prev.mapping,
        [currentlyOpenedQuestion]: value
      }
    }));
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

  // --- API logic ---
  const getMappings = async () => axios.get(`/dmp_mapping`);
  const getMapping = async (id) => axios.get(`/dmp_mapping/${id}`);
  const newMapping = async (data) => axios.post(`/dmp_mapping`, data);

  const updateMapping = async (data) => axios.put(`/dmp_mapping/${templateMappingId}`, data);
  const deleteMapping = async (id) => axios.delete(`/dmp_mapping/${id}`);

  const saveMapping = async () => {
    const data = {
      dmp_mapping: {
        mapping: mappingSchema.mapping,
        source_id: initialTemplateId,
        target_id: targetTemplateId,
        type_mapping: "form",
      }
    };
    
    if (templateMappingId) 
      await updateMapping(data);
    else {
      const res = await newMapping(data);
      console.log('New mapping:', res);
      if (res?.data?.mapping_data?.id)
        window.location.href = `/super_admin/template_mappings/${res.data.mapping_data.id}/edit`;
      else
        console.error('Redirection error:', res);
    }
  }

  // useEffect(() => {
  //   if (templateMappingId) {
  //     getMapping(templateMappingId)
  //       .then(res => {
  //         const { source_id, target_id, mapping } = res.data;
  //         setInitialTemplateId(source_id);
  //         setTargetTemplateId(target_id);
  //         setMappingSchema({mapping});
  //       });
  //   }
  // }, [templateMappingId]);
  // --- End API logic ---

  return (
    <SectionsMappingContext.Provider
      value={{
        mapping, setMapping, enableMapping,
        editorRef, setEditorRef,
        currentlyOpenedQuestion, setCurrentlyOpenedQuestion,
        buildJsonPath,
        forms, setIsStructuredModel, setIsHiddenQuestionsFields, setUsage,
        USAGE_INITIAL, USAGE_TARGET,
        DEFAULT_REF,
        initialTemplateId, setInitialTemplateId,
        targetTemplateId, setTargetTemplateId,
        mappingSchema, setMappingSchema, insertInMappingSchema,
        handleInsert, setHandleInsert,
        getMappings, getMapping, newMapping, updateMapping, deleteMapping, saveMapping,
        templateMappingId, setTemplateMappingId,
      }}
    >
      {children}
    </SectionsMappingContext.Provider>
  );
};
