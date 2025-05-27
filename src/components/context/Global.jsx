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
    // localStorage.removeItem('formData');
    // sessionStorage.removeItem("researchOutputs");
    return {};
  }
  return { ...formData, ...incomingFormData };
};

/* It's getting the form from localStorage. */
// const formLocalState = JSON.parse(localStorage.getItem('formData'));
// const researchOutputsLocalState = JSON.parse(sessionStorage.getItem("researchOutputs"));
export const GlobalContext = createContext();

/**
 * It's a function that takes a prop called children and returns a GlobalContext.Provider
 * component that has a value prop that is an object with two
 * properties: form and setform.
 * @returns The GlobalContext.Provider is being returned.
 */
function Global({ children }) {
  const [locale, setLocale] = useState('fr_FR');
  const [dmpId, setDmpId] = useState(null);
  const [persons, setPersons] = useState([]);
  // Plan Creation
  const [researchContext, setResearchContext] = useState(null);
  const [currentOrg, setCurrentOrg] = useState({})
  // Dynamic form
  const [formData, setFormData] = useReducer(reducer, {});
  const [loadedRegistries, setLoadedRegistries] = useState({});
  const [loadedTemplates, setLoadedTemplates] = useState({});
  // Write Plan
  const [loadedSectionsData, setLoadedSectionsData] = useState({});
  const [researchOutputs, setResearchOutputs] = useState([]);
  const [displayedResearchOutput, setDisplayedResearchOutput] = useState(null);
  const [openedQuestions, setOpenedQuestions] = useState(null);
  const [questionsWithGuidance, setQuestionsWithGuidance] = useState([]);
  const [userId, setUserId] = useState(-1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formSelectors, setFormSelector] = useState({});
  const [configuration, setConfiguration] = useState({});

  /* It's setting the formData in sessionStorage. */
  // useEffect(() => {
  //   /* It's setting the form in localStorage. */
  //   localStorage.setItem('formData', JSON.stringify(formData));
  // }, [formData]);

  /* It's setting the researchOutputs in sessionStorage. */
  // useEffect(() => {
  //   sessionStorage.setItem("researchOutputs", JSON.stringify(researchOutputs));
  // }, [researchOutputs]);

  const setUrlParams = (data = {}) => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const urlSearchParams = { ...params, ...data }
    Object.keys(urlSearchParams).forEach(key => (!urlSearchParams[key] || urlSearchParams[key] === '') && delete urlSearchParams[key]);
    const urlParams = new URLSearchParams(urlSearchParams);
    return window.history.replaceState(null, null, `${window.location.pathname}?${urlParams.toString()}`);
  };

  return (
    <GlobalContext.Provider
      value={{
        locale,
        setLocale,
        dmpId,
        setDmpId,
        persons,
        setPersons,
        // Plan Creation
        currentOrg,
        setCurrentOrg,
        researchContext,
        setResearchContext,
        // Dynamic form
        formData,
        setFormData,
        loadedRegistries,
        setLoadedRegistries,
        loadedTemplates,
        setLoadedTemplates,
        // Write Plan
        loadedSectionsData,
        setLoadedSectionsData,
        researchOutputs,
        setResearchOutputs,
        displayedResearchOutput,
        setDisplayedResearchOutput,
        openedQuestions,
        setOpenedQuestions,
        questionsWithGuidance,
        setQuestionsWithGuidance,
        userId,
        setUserId,
        setUrlParams,
        selectedTemplate,
        setSelectedTemplate,
        formSelectors,
        setFormSelector,
        configuration,
        setConfiguration,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default Global;
