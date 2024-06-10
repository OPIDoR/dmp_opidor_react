import React, { createContext, useState, useEffect, useRef } from 'react';
import useTemplate from '../../hooks/useTemplate';
import axios from '../../utils/AxiosClient';

export const SectionsMappingContext = createContext();

export const SectionsMappingProvider = ({ children }) => {

  // --- Mapping logic ---
  const [mapping, setMapping] = useState(false);
  const enableMapping = () => setMapping(true);
  const [isLoading, setIsLoading] = useState(true);
  const [templateMappingId, setTemplateMappingId] = useState(null);
  // --- End Mapping logic ---

  // --- Editor logic ---
  const DEFAULT_REF = useRef(null);
  const [editorRef, setEditorRef] = useState(DEFAULT_REF);
  const [handleInsert, setHandleInsert] = useState(() => () => { });
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
  const [mappingSchema, setMappingSchema] = useState({ mapping: {} });

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

  // --- API logic ---
  const MAPPING_URL = '/super_admin/template_mappings';
  const MAPPING_OPTIONS = { headers: { 'Accept': 'application/json' } };
  
  const getMappings = async () => axios.get(MAPPING_URL, MAPPING_OPTIONS);
  const getMapping = async (id) => axios.get(`${MAPPING_URL}/${id}`);
  const newMapping = async (data) => axios.post(MAPPING_URL, data);

  const updateMapping = async (data) => axios.put(`${MAPPING_URL}/${templateMappingId}`, data);
  const destroyMapping = async (id) => axios.delete(`${MAPPING_URL}/${id}`);

  /**
   * Save the current mapping
   * If the mapping is new, redirect to the edit page
   */
  const saveMapping = async () => {
    // console.log(mappingSchema.mapping);
    const data = {
      dmp_mapping: {
        mapping: mappingSchema.mapping,
        source_id: initialTemplateId,
        target_id: targetTemplateId,
        type_mapping: "form",
        name: "Mapping"
      }
    };

    if (templateMappingId) {
      await updateMapping(data);
      console.log("UPDATED");
    }
    else {
      const res = await newMapping(data);
      console.log('New mapping:', res);
      if (res?.data?.id)
        window.location.href = `/super_admin/template_mappings/${res.data.id}/edit`;
      else
        console.error('Redirection error:', res);
    }
  }

  /**
   * Delete the current mapping and redirect to the index page
   */
  const deleteMapping = async () => {
    if (!templateMappingId) return;
    await destroyMapping(templateMappingId);
    window.location.href = '/super_admin/template_mappings';
  }

  useEffect(() => {
    if (!mapping) return;
    setIsLoading(true);
    if (!templateMappingId) {
      setIsLoading(false);
      return;
    }

    const fetchMapping = async () => {
      try {
        const res = await getMapping(templateMappingId);
        console.log("data: ", res.data);
        const { source_id, target_id, mapping } = res.data;
        console.log("data: ", res.data);
        setInitialTemplateId(source_id);
        setTargetTemplateId(target_id);
        setMappingSchema({ mapping });
      } catch (error) {
        console.error('Failed to fetch mapping:', error);
      }
      setIsLoading(false);
    };

    fetchMapping();
  }, [templateMappingId]);

  // useEffect(() => {
  //   console.log('mappingSchema:', mappingSchema);
  //   console.log('templateMappingId:', templateMappingId);
  //   console.log('initialTemplateId:', initialTemplateId);
  //   console.log('targetTemplateId:', targetTemplateId);
  // });

  // --- End API logic ---


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
        currentlyOpenedQuestion, setCurrentlyOpenedQuestion,
        buildJsonPath,
        forms, setIsStructuredModel, setIsHiddenQuestionsFields, setUsage,
        USAGE_INITIAL, USAGE_TARGET,
        DEFAULT_REF,
        initialTemplateId, setInitialTemplateId,
        targetTemplateId, setTargetTemplateId,
        mappingSchema, setMappingSchema, insertInMappingSchema,
        handleInsert, setHandleInsert,
        getMappings, // getMapping, newMapping, updateMapping, destroyMapping, 
        saveMapping, deleteMapping,
        templateMappingId, setTemplateMappingId,
        isLoading,
      }}
    >
      {children}
    </SectionsMappingContext.Provider>
  );
};
