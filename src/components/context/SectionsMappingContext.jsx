import React, { createContext, useState, useEffect, useRef } from 'react';

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

  // --- BEHAVIOURS ---
  const buildJsonPath = (jsonPath, key, type) => {
    const jpKey = type === 'array'
      ? key + '[*]'
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
      }}
    >
      {children}
    </SectionsMappingContext.Provider>
  );
};
