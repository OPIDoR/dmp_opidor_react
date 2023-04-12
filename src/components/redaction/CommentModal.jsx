import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getComments, postComment, updateComment, deleteCommentById } from "../../services/DmpComentApi";
import moment from "moment";
import DOMPurify from "dompurify";
import CustomSpinner from "../Shared/CustomSpinner";
import { deleteByIndex } from "../../utils/GeneratorUtils";
import EditorComment from "./EditorComment";
import Swal from "sweetalert2";
import CustomError from "../Shared/CustomError";

function ModalComment({ show, setshowModalComment, setFillColorIconComment, answerId, researchOutputId, planId, questionId, userId }) {
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

  const NavBody = styled.div`
    color: #000;
    padding: 0px;
    margin-top: 4px;
    min-height: 320px;
    margin-right: 20px;
  `;
  const NavBodyText = styled.div`
    background: white; // Set the background color to white
    padding: 18px 18px 5px 18px; // Add padding if needed
    border-radius: 10px;
    margin: 10px;
    font-family: custumHelveticaLight;
    color: var(--primary);
  `;

  const ScrollNav = styled.div`
    max-height: 209px;
    overflow: auto;
    overflow-anchor: none;
    scrollbar-width: bold;
    scrollbar-color: var(--primary) transparent;
    &::-webkit-scrollbar {
      width: 16px;
      display: flex;
      justify-content: space-between;
      background: var(--white);
      border-radius: 13px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--primary);
      border-radius: 8px;
      border: 3px solid var(--white);
    }
  `;

  const MainNav = styled.div`
    display: flex;
    justify-content: end;
  `;

  const Close = styled.div`
    margin: 0px 21px 12px 0px;
    color: #fff;
    font-size: 25px;
  `;

  const ButtonComment = styled.button`
    margin: 10px 2px 2px 0px;
    color: #000;
    font-size: 18px;
    color: var(--primary) !important;
    font-family: custumHelveticaLight !important;
    border-radius: 8px !important;
  `;

  const CommentsCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0px 0px 10px;
  `;

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
      title: "Ëtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer cet élément ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        const newList = deleteByIndex(data, id);
        setData(newList);
        //deleteCommentById()
        Swal.fire("Supprimé!", "Opération effectuée avec succès!.", "success");
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
        {!loading && error && <CustomError></CustomError>}
        {!loading && !error && data && (
          <NavBody>
            <ScrollNav>
              {data.map((el, idx) => (
                <NavBodyText key={idx}>
                  <div
                    style={{ wordWrap: "break-word" }}
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
                        le {moment(el.created_at).format("DD/MM/YYYY")} à {moment(el.created_at).format("hh:mm:ss")}
                      </div>
                    </div>
                    <div style={{ marginRight: "-20px" }}>
                      <div className="col-md-1">
                        <span onClick={(e) => handleUpdate(e, el)}>
                          <i className="fa fa-edit" />
                        </span>
                      </div>
                      <div className="col-md-1">
                        <span onClick={(e) => handleDelete(e, idx)}>
                          <i className="fa fa-times" />
                        </span>
                      </div>
                    </div>
                  </CommentsCard>
                </NavBodyText>
              ))}
            </ScrollNav>

            <div style={{ margin: "10px" }}>
              <p style={{ color: "var(--white)", fontWeight: "bold", marginTop: "30px" }}>
                Ajoutez un commentaire à partager avec les collaborateurs
              </p>
              <EditorComment initialValue={text} updateParentText={updateParentText} />
            </div>
            <div style={{ margin: 10 }}>
              <ButtonComment className="btn btn-light" onClick={(e) => handleSave(e)}>
                {isUpdate ? "Modifier" : "Enregistrer"}
              </ButtonComment>
            </div>
          </NavBody>
        )}
      </>
    </div>
  );
}

export default ModalComment;
