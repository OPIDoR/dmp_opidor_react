import React, { createContext, useEffect, useReducer, useState } from "react";

/**
 * If the formInfo is null, remove the form from sessionStorage, otherwise return the form with the formInfo.
 * @param form - the current state of the form
 * @param formInfo - This is the object that contains the form data.
 * @returns The reducer is returning a new object that is a combination of the form object and the formInfo object.
 */
let reducer = (form, formInfo) => {
  if (formInfo === null) {
    sessionStorage.removeItem("form");
    sessionStorage.removeItem("pSearch");
    return {};
  }
  return { ...form, ...formInfo };
};

/* It's getting the form from sessionStorage. */
const formLocalState = JSON.parse(sessionStorage.getItem("form"));
const pSearchLocalState = JSON.parse(sessionStorage.getItem("pSearch"));
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
  const [isCollapsed, setIsCollapsed] = useState(null);

  const updateObjectByKey = (obj, keyToUpdate, newValue) => {
    if (obj.hasOwnProperty(keyToUpdate)) {
      obj[keyToUpdate] = newValue;
    }
    return obj;
  };

  useEffect(() => {
    console.log("ena el form");
    console.log({ ...form });
    productId && setPSearch({ ...pSearch, [productId]: { ...form } });
    //productId && setPSearch((prevPSearch) => updateObjectByKey({ ...prevPSearch }, productId, { ...form }));
  }, [form]);

  useEffect(() => {
    console.log("ena el product id");
    productId && setPSearch({ ...pSearch, [productId]: { ...form } });
    //productId && setPSearch((prevPSearch) => updateObjectByKey({ ...prevPSearch }, productId, { ...form }));
  }, [productId]);

  useEffect(() => {
    /* It's setting the form in sessionStorage. */
    sessionStorage.setItem("form", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    /* It's setting the form in sessionStorage. */
    sessionStorage.setItem("pSearch", JSON.stringify(pSearch));
  }, [pSearch]);

  return (
    <GlobalContext.Provider
      value={{
        form,
        setform,
        temp,
        settemp,
        lng,
        setlng,
        context,
        setContext,
        pSearch,
        setPSearch,
        productId,
        setproductId,
        plans,
        setPlans,
        isCollapsed,
        setIsCollapsed,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default Global;
