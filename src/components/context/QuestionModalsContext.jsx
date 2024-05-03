import React, { createContext, useState } from 'react';

export const QuestionModalsContext = createContext();

export const QuestionModalsProvider = ({ children }) => {
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showRunsModal, setShowRunsModal] = useState(false);
  const [showFormSelectorModal, setShowFormSelectorModal] = useState(false);

    const closeAllModals = () => {
      setShowGuidanceModal(false);
      setShowCommentModal(false);
      setShowRunsModal(false);
      setShowFormSelectorModal(false);
    };

  // const closeAllModals = () => {
  //   const modals = [
  //     { show: setShowCommentModal, fill: setFillCommentIconColor },
  //     { show: setShowGuidanceModal, fill: setFillGuidanceIconColor },
  //     { show: setShowFormSelectorModal, fill: setFillFormSelectorIconColor },
  //     { show: setShowRunsModal, fill: setFillRunsIconColor }
  //   ];

  //   modals.forEach(({ show, fill }) => {
  //     show(false);
  //     fill('var(--dark-blue)');
  //   });
  // };

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

