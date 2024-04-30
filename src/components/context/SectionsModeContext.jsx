import React, { createContext, useState } from 'react';
import { MODE_WRITING } from '../../hooks/useSectionsMode';

export const SectionsModeContext = createContext();

export const SectionsModeProvider = ({ children }) => {
  const [mode, setMode] = useState(MODE_WRITING);

  return (
    <SectionsModeContext.Provider
      value={{
        mode, setMode
      }}
    >
      {children}
    </SectionsModeContext.Provider>
  );
};
