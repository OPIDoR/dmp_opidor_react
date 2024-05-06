import React, { createContext, useState } from 'react';

export const SectionsModeContext = createContext();

export const SectionsModeProvider = ({ children }) => {
  // --- STATE ---
  const [mapping, setMapping] = useState(false);

  // --- BEHAVIOURS ---
  const enableMapping = () => {
    setMapping(true)
  }

  // --- RENDER ---
  return (
    <SectionsModeContext.Provider
      value={{
        mapping, setMapping, enableMapping
      }}
    >
      {children}
    </SectionsModeContext.Provider>
  );
};
