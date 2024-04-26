import React, { createContext, useState, useContext } from 'react';

export const ModeContext = createContext();

// export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('default');

  // return (
  //   <ModeContext.Provider value={{ mode, setMode }}>
  //     {children}
  //   </ModeContext.Provider>
  // );

  return (
    <ModeContext.Provider
      value={{
        mode, setMode
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
