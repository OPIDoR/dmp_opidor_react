import React, { createContext, useState } from 'react';
import axios from '../../utils/AxiosClient';

export const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);


  // --- BEHAVIOURS ---
  /**
 * The function retrieves data from session storage or sets it if it doesn't exist.
 * @param token - The `token` parameter is not used in the `getPlanData` function. It is not necessary for the function to work properly.
 * @returns An object with a property "data" that contains either the parsed JSON data from sessionStorage if it exists, or the original dataObject if it
 * does not.
 */
  const getPlanData = async (planId) => axios.get(`/plans/${planId}/answers_data`);

  const getSectionsData = async (templateId) => axios.get(`/templates/${templateId || ''}`);

  const fetchAndProcessSectionsData = async (templateId, afterFetchTreatment, params) => {
    try {
      const res = await getSectionsData(templateId);

      if (afterFetchTreatment)
        return afterFetchTreatment(res, ...params);

      return res;
    }
    catch (err) {
      setError(err);
    }
    finally {
      setLoading(false);
    }
  };


  // --- RENDER ---
  return (
    <TemplateContext.Provider value={{
      loading, setLoading,
      error, setError,
      sectionsData, setSectionsData,
      fetchAndProcessSectionsData,
      getPlanData, getSectionsData,
    }}>
      {children}
    </TemplateContext.Provider>
  );
};

