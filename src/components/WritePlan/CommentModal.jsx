import React, { useRef, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/Global';
import CustomSpinner from '../Shared/CustomSpinner';
import CustomError from '../Shared/CustomError';
import { useTranslation } from 'react-i18next';
import InnerModal from '../Shared/InnerModal/InnerModal';
import CommentList from '../Shared/CommentList';
import { comments as commentsService } from '../../services';

function CommentModal({ show, setshowModalComment, setAnswer, setFillColorIconComment, answerId, researchOutputId, planId, questionId, readonly }) {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const { userId } = useContext(GlobalContext);

  useEffect(() => {
    if(!answerId) return;

    setLoading(true);
    commentsService.get(answerId)
      .then(({ data }) => {
        setComments(data?.notes || []);
      })
      .catch((error) => setError({
        code: error?.response?.status,
        message: error?.response?.statusText,
        error: error?.response?.data?.message || '',
        home: false,
      }))
      .finally(() => setLoading(false));
  }, [answerId]);

  const updateComments = (comments) => setComments(comments);

  return (
    <InnerModal show={show} ref={modalRef}>
      <InnerModal.Header
        closeButton
        expandButton
        ref={modalRef}
        onClose={() => {
          setFillColorIconComment("var(--dark-blue)");
          setshowModalComment(false);
        }}
      >
        <InnerModal.Title>
          {t('Comments')} ({ comments.length || 0 })
        </InnerModal.Title>
      </InnerModal.Header>
      <InnerModal.Body style={{ borderRadius: '0 0 10px 10px' }}>
        {loading && <CustomSpinner />}
        {!loading && error && <CustomError error={error} />}
        {!loading && !error && comments && (
          <CommentList
            answerId={answerId}
            researchOutputId={researchOutputId}
            planId={planId}
            questionId={questionId}
            userId={userId}
            readonly={readonly}
            inModal={true}
            comments={comments}
            updateComments={updateComments}
            setAnswer={setAnswer}
          />
        )}
      </InnerModal.Body>
    </InnerModal>
  );
}

export default CommentModal;
