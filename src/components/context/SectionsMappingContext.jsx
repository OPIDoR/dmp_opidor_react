import React, { createContext, useState } from 'react';

export const SectionsMappingContext = createContext();

export const SectionsMappingProvider = ({ children }) => {
  // --- STATE ---
  const [mapping, setMapping] = useState(false);
  const [editorRef, setEditorRef] = useState(null);

  const [isStructuredModels, setIsStructuredModels] = useState({});

  const setIsStructuredModel = (id, value) => {
    setIsStructuredModels(prev => ({ ...prev, [id]: value }));
  };

  const enableMapping = () => {
    setMapping(true)
  }

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

  // --- RENDER ---
  return (
    <SectionsMappingContext.Provider
      value={{
        mapping, setMapping, enableMapping,
        editorRef, setEditorRef,
        buildJsonPath,
        isStructuredModels, setIsStructuredModel,
      }}
    >
      {children}
    </SectionsMappingContext.Provider>
  );
};
