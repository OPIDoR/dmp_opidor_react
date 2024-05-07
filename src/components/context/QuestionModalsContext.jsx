import React, { createContext, useState } from 'react';

export const QuestionModalsContext = createContext();

export const QuestionModalsProvider = ({ children }) => {
  // --- STATE ---
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showRunsModal, setShowRunsModal] = useState(false);
  const [showFormSelectorModal, setShowFormSelectorModal] = useState(false);

  // --- BEHAVIOURS ---
  const closeAllModals = () => {
    setShowGuidanceModal(false);
    setShowCommentModal(false);
    setShowRunsModal(false);
    setShowFormSelectorModal(false);
  };

  // --- RENDER ---
  return (
    <QuestionModalsContext.Provider value={{
      showGuidanceModal, setShowGuidanceModal,
      showCommentModal, setShowCommentModal,
      showRunsModal, setShowRunsModal,
      showFormSelectorModal, setShowFormSelectorModal,
      closeAllModals
    }}>
      {children}
    </QuestionModalsContext.Provider>
  );
};

