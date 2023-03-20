import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getComments, postNote, updateNote } from "../../services/DmpComentApi";
import moment from "moment";
import DOMPurify from "dompurify";
import CustumSpinner from "../Shared/CustumSpinner";
import { deleteByIndex } from "../../utils/GeneratorUtils";

function ModalComment({ show, setshowModalComment, setFillColorLight, answerId, researchOutputId, planId, questionId }) {
  const [data, setData] = useState(null);
  const [text, settext] = useState("<p></p>");
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
    marginLeft: "-804px",
    marginTop: "366px",
    width: "640px",
    color: "var(--white)",
    // overflow: "auto", // Add thi
  };

  const NavBody = styled.div`
    color: #000;
    padding: 0px;
    margin-top: 4px;
    min-height: 320px;
    max-height: 30px;
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
    overflow: auto;
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
      border-radius: 3px;
    }
  `;

  const MainNav = styled.div`
    display: flex;
    justify-content: end;
  `;

  const Close = styled.div`
    margin: 10px 2px 2px 0px;
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
   * The function handleChange takes in a parameter newText and sets the state of text to newText.
   */
  const handleChange = (newText) => {
    settext(newText);
  };

  /**
   * When the delete button is clicked, prevent the default action, stop the event from propagating,
   *  delete the item from the list, and set the new list as
   * the data.
   */
  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const newList = deleteByIndex(data, id);
    setData(newList);
    // deleteByIndex(id).then((res)=>{
    //setData(newList);
    // })
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
    //update
    if (isUpdate) {
      const newObject = { ...comment };
      newObject["text"] = text;
      newObject["updated_at"] = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
      const objToUpdate = {
        note: {
          text: "<p>Mon commentaire</p>",
        },
      };
      updateObjectById(newObject.id, newObject);
      settext("<p></p>");
      setisUpdate(false);
      // updateNote(objToUpdate, id).then((res)=>{
      //   console.log(res)
      // });

      //save
    } else {
      const obj = {
        note: {
          answer_id: 134,
          research_output_id: 345,
          plan_id: planId,
          user_id: 8,
          question_id: questionId,
          text: text,
        },
      };
      postNote(obj).then((res) => {
        const objectToShow = {
          id: res.note.id,
          user_id: 1,
          text: text,
          archived: false,
          answer_id: 11549,
          archived_by: null,
          created_at: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
          updated_at: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
          user: {
            firstname: "DMP",
            surname: "Administrator",
            email: "info-opidor@inist.fr",
          },
        };
        setData([...data, objectToShow]);
        settext("<p></p>");
      });
    }
  };

  return (
    <div style={modalStyles}>
      <MainNav>
        <Close
          className="close"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setshowModalComment(false);
            setFillColorLight("var(--primary)");
          }}
        >
          x
        </Close>
      </MainNav>
      <ScrollNav>
        {loading && <CustumSpinner></CustumSpinner>}
        {!loading && error && <p>error</p>}
        {!loading && !error && data && (
          <NavBody>
            {data.map((el, idx) => (
              <NavBodyText key={idx}>
                <div
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
                      <span>
                        <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleUpdate(e, el)}>
                          <i className="fa fa-edit" />
                        </a>
                      </span>
                    </div>
                    <div className="col-md-1">
                      <span>
                        <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDelete(e, idx)}>
                          <i className="fa fa-times" />
                        </a>
                      </span>
                    </div>
                  </div>
                </CommentsCard>
              </NavBodyText>
            ))}
            <div style={{ margin: "10px" }}>
              <p style={{ color: "var(--white)", fontWeight: "bold", marginTop: "30px" }}>
                Ajoutez un commentaire à partager avec les collaborateurs
              </p>
              <Editor
                apiKey={"xvzn7forg8ganzrt5s9id02obr84ky126f85409p7ny84ava"}
                onEditorChange={(newText) => handleChange(newText)}
                // onInit={(evt, editor) => (editorRef.current = editor)}
                value={text}
                init={{
                  branding: false,
                  height: 200,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
            <div style={{ margin: 10 }}>
              <ButtonComment className="btn btn-light" onClick={(e) => handleSave(e)}>
                {isUpdate ? "Modifier" : "Enregistrer"}
              </ButtonComment>
            </div>
          </NavBody>
        )}
      </ScrollNav>
    </div>
  );
}

export default ModalComment;
