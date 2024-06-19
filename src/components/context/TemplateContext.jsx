import React, { createContext, useState } from 'react';
import { sectionsContent } from '../../services';

export const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);

  // --- BEHAVIOURS ---
  const fetchAndProcessSectionsData = async (templateId, afterFetchTreatment, params) => {
    try {
      const res = await sectionsContent.getSectionsData(templateId);

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
    }}>
      {children}
    </TemplateContext.Provider>
  );
};

