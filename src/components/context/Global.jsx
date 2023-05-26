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
    sessionStorage.removeItem("searchProduct");
    return {};
  }
  return { ...formData, ...incomingFormData };
};

/* It's getting the form from localStorage. */
const formLocalState = JSON.parse(localStorage.getItem('formData'));
const pSearchLocalState = JSON.parse(sessionStorage.getItem("searchProduct"));
export const GlobalContext = createContext();

/**
 * It's a function that takes a prop called children and returns a GlobalContext.Provider
 * component that has a value prop that is an object with two
 * properties: form and setform.
 * @returns The GlobalContext.Provider is being returned.
 */
function Global({ children }) {
  const [formData, setFormData] = useReducer(reducer, formLocalState || {});
  const [subData, setSubData] = useState({});
  const [researchContext, setResearchContext] = useState('research_project');
  const [locale, setLocale] = useState('en');
  const [dmpId, setdmpId] = useState(null);
  const [currentOrg, setCurrentOrg] = useState({})
  const [searchProduct, setSearchProduct] = useState(pSearchLocalState || {});
  const [productId, setproductId] = useState(null);
  const [plans, setPlans] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (productId) {
      setSearchProduct((prevSearchProduct) => ({
        ...prevSearchProduct,
        [productId]: { ...formData },
      }));
    }
  }, [productId, formData]);

  /* It's setting the formData in sessionStorage. */
  useEffect(() => {
    /* It's setting the form in localStorage. */
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  /* This `useEffect` hook is watching for changes in the `lng` variable. If `lng` changes, it retrieves the `appLanguage` value from sessionStorage using
the key "lng". If `appLanguage` is truthy (not null, undefined, 0, false, or an empty string), it updates the `lng` state by setting it to
`appLanguage`. Then, it sets the "lng" key in sessionStorage to the language code (the first part of the language string) of the current i18n
language. This is essentially saving the user's language preference in sessionStorage. */
  useEffect(() => {
    const appLanguage = sessionStorage.getItem("locale");
    if (appLanguage) {
      setLocale(appLanguage);
    } else {
      sessionStorage.setItem("locale", locale.substring(0, 2));
    }
  }, [locale]);

  /* It's setting the searchProduct in sessionStorage. */
  useEffect(() => {
    sessionStorage.setItem("searchProduct", JSON.stringify(searchProduct));
  }, [searchProduct]);

  return (
    <GlobalContext.Provider
      value={{
        formData,
        setFormData,
        subData,
        setSubData,
        locale,
        setLocale,
        dmpId,
        setdmpId,
        currentOrg,
        setCurrentOrg,
        researchContext,
        setResearchContext,
        searchProduct,
        setSearchProduct,
        productId,
        setproductId,
        plans,
        setPlans,
        isCollapsed,
        setIsCollapsed,
        productData,
        setProductData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default Global;
