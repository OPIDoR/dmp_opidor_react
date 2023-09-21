import React, { useEffect, useRef, useState, useContext} from "react";
import { comments as commentsService } from "../../services";
import { format } from "date-fns";
import { fr, enGB } from 'date-fns/locale'
import toast from 'react-hot-toast';
import DOMPurify from "dompurify";
import { IoClose } from "react-icons/io5";
import { GlobalContext } from "../context/Global";
import CustomSpinner from "../Shared/CustomSpinner";
import EditorComment from "./EditorComment";
import Swal from "sweetalert2";
import CustomError from "../Shared/CustomError";
import { NavBody, NavBodyText, ScrollNav, MainNav, Close, ButtonComment, CommentsCard, Title } from "./styles/CommentModalStyles";
import { useTranslation } from "react-i18next";
import { BiEdit } from "react-icons/bi";
import { FaTrash } from "react-icons/fa6";

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

  const { userId } = useContext(GlobalContext);

  const modalStyles = {
    display: show ? "block" : "none",
    position: "absolute",
    zIndex: 99,
    background: "var(--primary)",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginLeft: "-825px",
    marginTop: "570px",
    width: "640px",
    color: "var(--white)",
  };

  const style = {
    margin: "0",
    wordWrap: "break-word",
  };

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

    setText("<p></p>");

    return isUpdate ? update(newText, comment) : createComment(newText);
  };

  return (
    <div
      style={modalStyles}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <MainNav>
        <Title>Comments ({ comments.length || 0 })</Title>
        <Close
          className="close"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setshowModalComment(false);
            setFillColorIconComment("var(--primary)");
          }}
        >
          <IoClose size={24} />
        </Close>
      </MainNav>

      <>
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError error={error}></CustomError>}
        {!loading && !error && comments && (
          <NavBody>
            <ScrollNav>
              {comments.map((el, idx) => (
                <NavBodyText key={idx}>
                  <div
                    style={style}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize([el.text]),
                    }}
                  />
                  {/* {el.text} */}
                  <CommentsCard>
                    <div style={{ display: "flex" }}>
                      <strong style={{ fontWeight: "bold", fontSize: "17px" }}>
                        {el.user.surname} {el.user.firstname}
                      </strong>
                      <div style={{ marginLeft: "4px", fontStyle: "italic" }}>
                        {t("on")} {format(new Date(el.created_at), "dd/MM/yyyy", { locale: locales[i18n.resolvedLanguage || 'fr'] })} {t("at")} {format(new Date(el.created_at), "hh:mm:ss", { locale: locales[i18n.resolvedLanguage || 'fr'] })}
                      </div>
                    </div>
                    {!readonly && userId === el.user.id && (
                      <div>
                        <BiEdit size={22} onClick={(e) => handleUpdate(e, el)} />
                        <FaTrash size={22} onClick={(e) => handleDelete(e, el.id)} />
                      </div>
                    )}
                  </CommentsCard>
                </NavBodyText>
              ))}
            </ScrollNav>
            {!readonly && (
              <>
                <div style={{ margin: "10px" }}>
                  <p style={{ color: "var(--white)", fontWeight: "bold", marginTop: "30px" }}>{t("Add a comment to share with collaborators")}</p>
                  <EditorComment initialValue={text} updateParentText={updateParentText} />
                </div>
                <div style={{ margin: 10 }}>
                  <ButtonComment className="btn btn-light" onClick={(e) => handleSave(e)}>
                    {isUpdate ? t("Update") : t("Save")}
                  </ButtonComment>
                </div>
              </>
            )}
          </NavBody>
        )}
      </>
    </div>
  );
}

export default CommentModal;
