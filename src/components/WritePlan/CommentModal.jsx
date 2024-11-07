import React, { useRef, useContext, useState } from 'react';
import { GlobalContext } from '../context/Global';
import { useTranslation } from 'react-i18next';
import InnerModal from '../Shared/InnerModal/InnerModal';
import CommentList from '../Shared/CommentList';

function CommentModal({ shown, hide, setAnswer, answerId, researchOutputId, planId, questionId, readonly }) {
  const { t } = useTranslation();
  const [commentsNumber, setCommentsNumber] = useState(0);
  const modalRef = useRef(null);
  const { userId } = useContext(GlobalContext);

  return (
    <InnerModal show={shown} ref={modalRef}>
      <InnerModal.Header
        closeButton
        expandButton
        ref={modalRef}
        onClose={() => {
          hide();
        }}
      >
        <InnerModal.Title id={`#notes-title-${questionId}-research-output-${researchOutputId}`}>
          {t('Comments')} ({commentsNumber})
        </InnerModal.Title>
      </InnerModal.Header>
      <InnerModal.Body style={{ borderRadius: '0 0 10px 10px' }}>
        <CommentList
            answerId={answerId}
            researchOutputId={researchOutputId}
            planId={planId}
            questionId={questionId}
            userId={userId}
            readonly={readonly}
            inModal={true}
            setAnswer={setAnswer}
            setCommentsNumber={setCommentsNumber}
          />
      </InnerModal.Body>
    </InnerModal>
  );
}

export default CommentModal;
