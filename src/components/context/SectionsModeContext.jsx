import React, { createContext, useState } from 'react';

export const SectionsModeContext = createContext();

export const SectionsModeProvider = ({ children }) => {
  const [mode, setMode] = useState('default');

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
