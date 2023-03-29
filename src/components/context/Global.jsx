import React, { createContext, useEffect, useReducer, useState } from "react";

/**
 * If the formInfo is null, remove the form from localStorage, otherwise return the form with the formInfo.
 * @param form - the current state of the form
 * @param formInfo - This is the object that contains the form data.
 * @returns The reducer is returning a new object that is a combination of the form object and the formInfo object.
 */
let reducer = (form, formInfo) => {
  if (formInfo === null) {
    localStorage.removeItem("form");
    localStorage.removeItem("pSearch");
    return {};
  }
  return { ...form, ...formInfo };
};

/* It's getting the form from localStorage. */
const formLocalState = JSON.parse(localStorage.getItem("form"));
const pSearchLocalState = JSON.parse(localStorage.getItem("pSearch"));
export const GlobalContext = createContext();

/**
 * It's a function that takes a prop called children and returns a GlobalContext.Provider
 * component that has a value prop that is an object with two
 * properties: form and setform.
 * @returns The GlobalContext.Provider is being returned.
 */
function Global({ children }) {
  const [form, setform] = useReducer(reducer, formLocalState || {});
  const [temp, settemp] = useState(null);
  const [context, setContext] = useState({ context: "research_project" });
  const [lng, setlng] = useState("fr");
  const [pSearch, setPSearch] = useState(pSearchLocalState || {});
  const [productId, setproductId] = useState(null);
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    productId && setPSearch({ ...pSearch, [productId]: form });
  }, [productId, form]);

  useEffect(() => {
    /* It's setting the form in localStorage. */
    localStorage.setItem("form", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    /* It's setting the form in localStorage. */
    localStorage.setItem("pSearch", JSON.stringify(pSearch));
  }, [pSearch]);

  return (
    <GlobalContext.Provider
      value={{ form, setform, temp, settemp, lng, setlng, context, setContext, pSearch, setPSearch, productId, setproductId, plans, setPlans }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default Global;
