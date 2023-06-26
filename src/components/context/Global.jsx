import React, {
  createContext, useEffect, useReducer, useState,
} from 'react';

/**
 * If the incomingFormData is null, remove the formData from localStorage,
 * otherwise return the formData with the incomingFormData.
 * @param formData - the current state of the form
 * @param incomingFormData - This is the object that contains the form data.
 * @returns The reducer is returning a new object that is a combination of the
 * formData object and the incomingFormData object.
 */
const reducer = (formData, incomingFormData) => {
  if (incomingFormData === null) {
    localStorage.removeItem('formData');
    sessionStorage.removeItem("researchOutputs");
    return {};
  }
  return { ...formData, ...incomingFormData };
};

/* It's getting the form from localStorage. */
const formLocalState = JSON.parse(localStorage.getItem('formData'));
const researchOutputsLocalState = JSON.parse(sessionStorage.getItem("researchOutputs"));
export const GlobalContext = createContext();

/**
 * It's a function that takes a prop called children and returns a GlobalContext.Provider
 * component that has a value prop that is an object with two
 * properties: form and setform.
 * @returns The GlobalContext.Provider is being returned.
 */
function Global({ children }) {
  const [locale, setLocale] = useState('en');
  const [dmpId, setDmpId] = useState(null);
  // Plan Creation
  const [researchContext, setResearchContext] = useState('research_project');
  const [currentOrg, setCurrentOrg] = useState({})
  // Dynamic form
  const [formData, setFormData] = useReducer(reducer, formLocalState || {});
  const [subData, setSubData] = useState({});
  const [loadedRegistries, setLoadedRegistries] = useState({});
  const [loadedTemplates, setLoadedTemplates] = useState({});
  // Write Plan
  const [researchOutputs, setResearchOutputs] = useState(researchOutputsLocalState || {});
  const [displayedResearchOutput, setDisplayedResearchOutput] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(null);
  const [researchOutputsData, setResearchOutputsData] = useState(null);


  useEffect(() => {
    if (displayedResearchOutput) {
      setResearchOutputs((prevResearchOutput) => ({
        ...prevResearchOutput,
        [displayedResearchOutput]: { ...formData },
      }));
    }
  }, [displayedResearchOutput, formData]);

  /* It's setting the formData in sessionStorage. */
  useEffect(() => {
    /* It's setting the form in localStorage. */
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  /* It's setting the researchOutputs in sessionStorage. */
  useEffect(() => {
    sessionStorage.setItem("researchOutputs", JSON.stringify(researchOutputs));
  }, [researchOutputs]);

  return (
    <GlobalContext.Provider
      value={{
        locale,
        setLocale,
        dmpId,
        setDmpId,
        // Plan Creation
        currentOrg,
        setCurrentOrg,
        researchContext,
        setResearchContext,
        // Dynamic form
        formData,
        setFormData,
        subData,
        setSubData,
        loadedRegistries,
        setLoadedRegistries,
        loadedTemplates,
        setLoadedTemplates,
        // Write Plan
        displayedResearchOutput,
        setDisplayedResearchOutput,
        isCollapsed,
        setIsCollapsed,
        researchOutputsData,
        setResearchOutputsData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default Global;
