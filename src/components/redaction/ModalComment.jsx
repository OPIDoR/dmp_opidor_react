import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getComments } from "../../services/DmpComentApi";

function ModalComment({ show, setshowModalComment, setFillColorLight }) {
  const [data, setData] = useState(null);
  const [text, settext] = useState("<p></p>");

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

  useEffect(() => {
    getComments("", "").then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  }, []);

  const handleChange = (newText, editor) => {
    // editor.preventDefault();
    // editor.stopPropagation();
    settext(newText);
    console.log(newText);
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
        <NavBody>
          {data &&
            data.slice(0, 2).map((el, idx) => (
              <NavBodyText key={idx}>
                {el.text}
                <CommentsCard>
                  <div style={{ display: "flex" }}>
                    <strong style={{ fontWeight: "bold", fontSize: "17px" }}>{el.author}</strong>
                    <div style={{ marginLeft: "4px", fontStyle: "italic" }}>
                      le {el.date} à {el.time}
                    </div>
                  </div>
                  <div style={{ marginRight: "-20px" }}>
                    <div className="col-md-1">
                      <span>
                        <a className="text-primary" href="#" aria-hidden="true">
                          <i className="fa fa-edit" />
                        </a>
                      </span>
                    </div>
                    <div className="col-md-1">
                      <span>
                        <a className="text-primary" href="#" aria-hidden="true">
                          <i className="fa fa-times" />
                        </a>
                      </span>
                    </div>
                  </div>
                </CommentsCard>
              </NavBodyText>
            ))}
          <div style={{ margin: "10px" }}>
            <p style={{ color: "var(--white)", fontWeight: "bold", marginTop: "30px" }}>Ajoutez un commentaire à partager avec les collaborateurs</p>
            <Editor
              apiKey={"xvzn7forg8ganzrt5s9id02obr84ky126f85409p7ny84ava"}
              onEditorChange={(newText, editor) => handleChange(newText, editor)}
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
            <ButtonComment className="btn btn-light">Enregistrer</ButtonComment>
          </div>
        </NavBody>
      </ScrollNav>
    </div>
  );
}

export default ModalComment;
