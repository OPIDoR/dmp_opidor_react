import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const EditorComment = ({ initialValue, updateParentText }) => {
  const handleEditorChange = (content) => {
    updateParentText(content);
  };
  return (
    <Editor
      apiKey={"xvzn7forg8ganzrt5s9id02obr84ky126f85409p7ny84ava"}
      onEditorChange={handleEditorChange}
      initialValue={initialValue}
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
  );
};

export default React.memo(EditorComment);
