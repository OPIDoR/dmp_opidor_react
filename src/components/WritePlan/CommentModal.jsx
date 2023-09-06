import React, { useEffect, useRef, useState } from "react";
import { getComments, postComment, updateComment, deleteCommentById } from "../../services/DmpComentApi";
import moment from "moment";
import DOMPurify from "dompurify";
import CustomSpinner from "../Shared/CustomSpinner";
import { deleteByIndex } from "../../utils/GeneratorUtils";
import EditorComment from "./EditorComment";
import Swal from "sweetalert2";
import CustomError from "../Shared/CustomError";
import { NavBody, NavBodyText, ScrollNav, MainNav, Close, ButtonComment, CommentsCard } from "./styles/CommentModalStyles";
import { useTranslation } from "react-i18next";

function CommentModal({ show, setshowModalComment, setFillColorIconComment, answerId, researchOutputId, planId, questionId, userId, readonly }) {
  const { t } = useTranslation();
  const editorContentRef = useRef(null);
  const [text, settext] = useState("<p></p>");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdate, setisUpdate] = useState(false);
  const [comment, setComment] = useState(null);

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
    getComments("", "")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

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
        const newList = deleteByIndex(data, id);
        setData(newList);
        //deleteCommentById()
        Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
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
    settext(element.text);
    setisUpdate(true);
    setComment(element);
  };

  /**
   * If the id of the item matches the id of the updatedObject, then return a new object
   *  that is a copy of the item with the updatedObject properties
   * merged into it. Otherwise, return the item.
   */
  const updateObjectById = (id, updatedObject) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedObject };
      }
      return item;
    });
    setData(newData);
  };

  /**
   * I'm trying to update the state of the component with the new data.
   */
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newText = editorContentRef.current;
    const currentTime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    if (isUpdate) {
      const updatedObject = {
        ...comment,
        text: newText,
        updated_at: currentTime,
      };
      //updateComment()
      updateObjectById(updatedObject.id, updatedObject);
    } else {
      const newNote = {
        note: {
          answer_id: answerId,
          research_output_id: researchOutputId,
          plan_id: planId,
          user_id: userId,
          question_id: questionId,
          text: newText,
        },
      };

      postComment(newNote).then((res) => {
        const objectToShow = {
          ...newNote.note,
          id: res.note.id,
          user_id: 1,
          archived: false,
          answer_id: 11549,
          archived_by: null,
          created_at: currentTime,
          updated_at: currentTime,
          user: {
            firstname: "DMP",
            surname: "Administrator",
            email: "info-opidor@inist.fr",
          },
        };
        setData((prevData) => [...prevData, objectToShow]);
      });
    }

    settext("<p></p>");
    setisUpdate(false);
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
        <Close
          className="close"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setshowModalComment(false);
            setFillColorIconComment("var(--primary)");
          }}
        >
          x
        </Close>
      </MainNav>

      <>
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError error={error}></CustomError>}
        {!loading && !error && data && (
          <NavBody>
            <ScrollNav>
              {data.map((el, idx) => (
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
                        {t("on")} {moment(el.created_at).format("DD/MM/YYYY")} {t("at")} {moment(el.created_at).format("hh:mm:ss")}
                      </div>
                    </div>
                    {!readonly && (
                      <div style={{ marginRight: "-20px" }}>
                        <div className="col-md-1">
                          <span onClick={(e) => handleUpdate(e, el)}>
                            <i className="fa fa-pen-to-square" />
                          </span>
                        </div>
                        <div className="col-md-1">
                          <span onClick={(e) => handleDelete(e, idx)}>
                            <i className="fa fa-xmark" />
                          </span>
                        </div>
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
