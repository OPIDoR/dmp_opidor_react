import React, { createContext, useState, useContext } from 'react';

export const SectionsModeContext = createContext();

// export const useMode = () => useContext(ModeContext);

export const SectionsModeProvider = ({ children }) => {
  const [mode, setMode] = useState('default');

  // return (
  //   <ModeContext.Provider value={{ mode, setMode }}>
  //     {children}
  //   </ModeContext.Provider>
  // );

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
