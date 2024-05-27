import React, { forwardRef, useEffect, useState } from "react";
import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";
import useTemplate from "../../hooks/useTemplate";
import useSectionsMapping from "../../hooks/useSectionsMapping";

const CodeEditor = forwardRef(({ 
  templateId,
  // onChange,
}, ref) => {

  const { setLoading } = useTemplate();
  const { 
    mappingSchema,
    editorRef,
    setHandleInsert,
  } = useSectionsMapping();
  const [content, setContent] = useState("");

  useEffect(() => {
    setLoading(true);
    console.log(mappingSchema);
    setContent(JSON.stringify(mappingSchema.mapping, null, 2));
  }, [templateId, mappingSchema]);


  // --- MappingButton logic ---
  const handleInsert = (path) => {
    if (editorRef.current && path) {
      const editor = editorRef.current.editor; // Access to the Ace editor instance
      const position = editor.getCursorPosition(); // Get the current cursor position
      editor.session.insert(position, path); // Insert path at the current cursor position
    }
  };

  useEffect(() => {
    setHandleInsert(() => handleInsert);
  }, [editorRef]);
  // --- End MappingButton logic ---

  return <AceEditor
    mode="json"
    theme="github"
    // theme="monokai"
    // onChange={onChange}
    name="json-editor"
    value={content}
    editorProps={{ $blockScrolling: true }}
    width="40vw"
    ref={ref}
    // height="100%"
  />
});

export default CodeEditor;