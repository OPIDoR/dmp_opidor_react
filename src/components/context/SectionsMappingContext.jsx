import React, { createContext, useState } from 'react';

export const SectionsMappingContext = createContext();

export const SectionsMappingProvider = ({ children }) => {
  // --- STATE ---
  const [mapping, setMapping] = useState(false);
  const [editorRef, setEditorRef] = useState(null);

  // --- BEHAVIOURS ---
  const enableMapping = () => {
    setMapping(true)
  }

  // --- RENDER ---
  return (
    <SectionsMappingContext.Provider
      value={{
        mapping, setMapping, enableMapping,
        editorRef, setEditorRef,
      }}
    >
      {children}
    </SectionsMappingContext.Provider>
  );
};
