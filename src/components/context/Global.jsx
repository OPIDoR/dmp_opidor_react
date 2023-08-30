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
    sessionStorage.removeItem("searchProduct");
    return {};
  }
  return { ...form, ...formInfo };
};

/* It's getting the form from sessionStorage. */
const formLocalState = JSON.parse(sessionStorage.getItem("form"));
const pSearchLocalState = JSON.parse(sessionStorage.getItem("searchProduct"));
export const GlobalContext = createContext();

/**
 * It's a function that takes a prop called children and returns a GlobalContext.Provider
 * component that has a value prop that is an object with two
 * properties: form and setForm.
 * @returns The GlobalContext.Provider is being returned.
 */
function Global({ children }) {
  const [form, setForm] = useReducer(reducer, formLocalState || {});
  const [temp, setTemp] = useState(null);
  const [context, setContext] = useState({ context: "research_project" });
  const [searchProduct, setSearchProduct] = useState(pSearchLocalState || {});
  const [productId, setproductId] = useState(null);
  const [plans, setPlans] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(null);
  const [productData, setProductData] = useState(null);
  const [isEmail, setIsEmail] = useState(false);

  /* This `useEffect` hook is watching for changes in the `productId` and `form` variables. If `productId` is truthy (not null, undefined, 0, false, or an
empty string), it updates the `searchProduct` state by setting it to a new object that is a copy of the previous `searchProduct` state with a new
key-value pair where the key is `productId` and the value is a copy of the `form` state. This is essentially updating the `searchProduct` state with
the latest form data for a specific product. */
  useEffect(() => {
    if (productId) {
      setSearchProduct((prevSearchProduct) => ({
        ...prevSearchProduct,
        [productId]: { ...form },
      }));
    }
  }, [productId, form]);

  /* It's setting the form in sessionStorage. */
  useEffect(() => {
    sessionStorage.setItem("form", JSON.stringify(form));
  }, [form]);

  /* It's setting the searchProduct in sessionStorage. */
  useEffect(() => {
    sessionStorage.setItem("searchProduct", JSON.stringify(searchProduct));
  }, [searchProduct]);

  return (
    <GlobalContext.Provider
      value={{
        form,
        setForm,
        temp,
        setTemp,
        context,
        setContext,
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
        isEmail,
        setIsEmail,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default Global;
