import React, { createContext, useState, useEffect } from 'react';

export const SectionsMappingContext = createContext();

export const SectionsMappingProvider = ({ children }) => {
  // --- STATE ---
  const [mapping, setMapping] = useState(false);
  const [editorRef, setEditorRef] = useState(null);
  
  const [forms, setForms] = useState({}); // Associate a form id to its structure and content display mode

  const setIsStructuredModel = (id, value) => {
    setForms(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        structured: value
      }
    }))
  };

  const setIsHiddenQuestionsFields = (id, value) => setForms(prev => ({
    ...prev,
    [id]: {
      ...prev[id],
      hiddenQuestionsFields: value
    }
  }));

  const enableMapping = () => setMapping(true)

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


  // useEffect(() => {
  //   console.log('Forms updated:', forms);
  // }, [forms]);

  // --- RENDER ---
  return (
    <SectionsMappingContext.Provider
      value={{
        mapping, setMapping, enableMapping,
        editorRef, setEditorRef,
        buildJsonPath,
        forms, setIsStructuredModel, setIsHiddenQuestionsFields
      }}
    >
      {children}
    </SectionsMappingContext.Provider>
  );
};
