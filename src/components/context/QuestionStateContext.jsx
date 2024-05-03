import React, { createContext, useState, useContext } from 'react';

export const QuestionStateContext = createContext();

export const QuestionStateProvider = ({ children }) => {
  const [fragmentId, setFragmentId] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [scriptsData, setScriptsData] = useState({ scripts: [] });

  return (
    <QuestionStateContext.Provider value={{
      fragmentId, setFragmentId,
      answerId, setAnswerId,
      scriptsData, setScriptsData
    }}>
      {children}
    </QuestionStateContext.Provider>
  );
};