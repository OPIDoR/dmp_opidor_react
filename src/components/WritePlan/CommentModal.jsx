import React, { useEffect, useRef, useState, useContext } from "react";
import { comments as commentsService } from "../../services";
import { format } from "date-fns";
import { fr, enGB } from 'date-fns/locale'
import toast from 'react-hot-toast';
import DOMPurify from "dompurify";
import { GlobalContext } from "../context/Global";
import CustomSpinner from "../Shared/CustomSpinner";
import EditorComment from "./EditorComment";
import Swal from "sweetalert2";
import CustomError from "../Shared/CustomError";
import { NavBodyText, ScrollNav, CommentsCard } from "./styles/CommentModalStyles";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { FaTrash } from "react-icons/fa6";
import InnerModal from "../Shared/InnerModal/InnerModal";

import { Button } from 'react-bootstrap';

const locales = { fr, en: enGB };

function CommentModal({ show, setshowModalComment, setFillColorIconComment, answerId, researchOutputId, planId, questionId, readonly }) {
  const { t, i18n } = useTranslation();
  const editorContentRef = useRef(null);
  const [text, setText] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [comment, setComment] = useState(null);
  const modalRef = useRef(null);

  const { userId } = useContext(GlobalContext);

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
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

  /**
   * "updateParentText" is a function that takes in a parameter called "updatedText" and then sets the value of "editorContentRef.current" to
   * "updatedText".
   */
  const updateParentText = (updatedText) => {
    editorContentRef.current = updatedText;
  };

  /**
   * When the delete button is clicked, prevent the default action, stop the event from propagating,
   *  delete the item from the list, and set the new list as
   * the data.
   */
  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        commentsService.archive(id, {
          archived_by: userId,
        }).then(() => {
          const index = comments.findIndex((el) => el.id === id);

          if (!index < 0) {
            Swal.fire({
              title: t("Deleted!"),
              message: t("A problem has occurred while updating the comments"),
              icon: 'error',
            });
            return;
          }

          Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");

          const updatedComments = [...comments];
          updatedComments.splice(index, 1);
          setComments(updatedComments);
        }).catch(() => {
          Swal.fire({
            title: t("Deleted!"),
            message: t("A problem has occurred while updating the comments"),
            icon: 'error',
          });
        })
      }
    });
  };

  /**
   * When the user clicks the update button, the text of the comment is set to the text of
   *  the comment that was clicked, the isUpdate state is set to true,
   * and the comment state is set to the comment that was clicked.
   */
  const handleUpdate = (e, element) => {
    e.preventDefault();
    e.stopPropagation();
    setText(element.text);
    setIsUpdate(true);
    setComment(element);
  };

  const update = async (commentText, commentData) => {
    let response;
      try {
        response = await commentsService.update({
          ...commentData,
          text: commentText,
        });
      } catch (error) {
        return toast.error(t('An error has occurred while sending the comment.'));
      }

      if (!response) {
        return toast.error(t('An error has occurred while sending the comment.'));
      }

      const { data } = response;

      const updatedComment = {
        ...comment,
        ...data?.note,
      };

      const index = comments.findIndex(item => item.id === updatedComment.id);
      if (index === -1) { return; }

      const updatedComments = [...comments];
      updatedComments[index] = updatedComment;

      setComments(updatedComments);

      setIsUpdate(false);

      return toast.success(t('Comment sent successfully.'));
  }

  const createComment = async (newText) => {
    const note = {
      answer_id: answerId,
      research_output_id: researchOutputId,
      plan_id: planId,
      question_id: questionId,
      text: newText,
      user_id: userId,
    };

    let response;
    try {
      response = await commentsService.create({ note });
    } catch (error) {
      return toast.error(t('An error has occurred while sending the comment.'));
    }

    if (!response) {
      return toast.error(t('An error has occurred while sending the comment.'));
    }

    const { data } = response;

    const newNote = {
      ...note,
      ...data?.note,
    };
    setComments((prevData) => [newNote, ...prevData]);

    setText(null);
    setIsUpdate(false);

    return toast.success(t('Comment sent successfully.'));
  }

  /**
   * I'm trying to update the state of the component with the new data.
   */
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newText = editorContentRef.current;

    if (!newText) {
      return toast.error(t('Unable to send the comment, please enter a valid comment.'));
    }

    setText('<p></p>');

    return isUpdate ? update(newText, comment) : createComment(newText);
  };

  return (
    <InnerModal show={show} ref={modalRef}>
      <InnerModal.Header
        closeButton
        expandButton
        ref={modalRef}
        onClose={() => {
          setFillColorIconComment("var(--primary)");
          setshowModalComment(false);
        }}
      >
        <InnerModal.Title>
          {t('Comments')} ({ comments.length || 0 })
        </InnerModal.Title>
      </InnerModal.Header>
      <InnerModal.Body>
        {loading && <CustomSpinner />}
        {!loading && error && <CustomError error={error} />}
        {!loading && !error && comments && (
          <>
            <ScrollNav>
              {comments.map((comment, idx) => (
                <NavBodyText key={idx}>
                  <div
                    style={{ margin: 0, wordWrap: 'break-word' }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize([comment.text]),
                    }}
                  />
                  <CommentsCard>
                    <div>
                      <strong style={{ fontSize: "17px" }}>{comment.user.surname} {comment.user.firstname}</strong>
                      {' '}
                      <i>{t("on")} {format(new Date(comment.created_at), "dd/MM/yyyy", { locale: locales[i18n.resolvedLanguage || 'fr'] })} {t("at")} {format(new Date(comment.created_at), "HH:mm:ss", { locale: locales[i18n.resolvedLanguage || 'fr'] })}</i>
                    </div>
                    {!readonly && userId === comment.user.id && (
                      <div>
                        <BiEdit
                          size={22}
                          style={{ marginRight: '5px', cursor: 'pointer' }}
                          onClick={(e) => handleUpdate(e, comment)}
                        />
                        <FaTrash
                          size={22}
                          style={{ marginLeft: '5px', cursor: 'pointer' }}
                          onClick={(e) => handleDelete(e, comment.id)}
                        />
                      </div>
                    )}
                  </CommentsCard>
                </NavBodyText>
              ))}
            </ScrollNav>
            <div>
              <p style={{ color: "var(--white)", fontWeight: "bold", marginTop: "30px" }}>{t("Add a comment to share with collaborators")}</p>
              <EditorComment initialValue={text} updateParentText={updateParentText} />
            </div>
          </>
        )}
      </InnerModal.Body>
      <InnerModal.Footer>
        <InnerModal.Spacer />

        {!readonly && loading && !error && (
          <Button variant="primary" onClick={(e) => handleSave(e)}>
            {isUpdate ? t("Update") : t("Save")}
          </Button>
        )}
      </InnerModal.Footer>
    </InnerModal>
  );
}

export default CommentModal;
