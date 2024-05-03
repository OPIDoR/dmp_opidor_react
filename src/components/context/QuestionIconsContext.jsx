import React, { createContext, useState, useContext } from 'react';

export const QuestionIconsContext = createContext();

export const QuestionIconsProvider = ({ children }) => {
  const CSS_VAR_DARK_BLUE = "var(--dark-blue)";
  
  const [fillRunsIconColor, setFillRunsIconColor] = useState(CSS_VAR_DARK_BLUE);
  const [fillCommentIconColor, setFillCommentIconColor] = useState(CSS_VAR_DARK_BLUE);
  const [fillGuidanceIconColor, setFillGuidanceIconColor] = useState(CSS_VAR_DARK_BLUE);
  const [fillFormSelectorIconColor, setFillFormSelectorIconColor] = useState(CSS_VAR_DARK_BLUE);

  const resetIconColors = () => {
    setFillRunsIconColor(CSS_VAR_DARK_BLUE);
    setFillCommentIconColor(CSS_VAR_DARK_BLUE);
    setFillGuidanceIconColor(CSS_VAR_DARK_BLUE);
    setFillFormSelectorIconColor(CSS_VAR_DARK_BLUE);
  };

  return (
    <QuestionIconsContext.Provider value={{
      fillRunsIconColor, setFillRunsIconColor,
      fillCommentIconColor, setFillCommentIconColor,
      fillGuidanceIconColor, setFillGuidanceIconColor,
      fillFormSelectorIconColor, setFillFormSelectorIconColor,
      resetIconColors
    }}>
      {children}
    </QuestionIconsContext.Provider>
  );
};