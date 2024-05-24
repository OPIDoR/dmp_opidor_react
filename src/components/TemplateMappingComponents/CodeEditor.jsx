import React from "react";
import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";

function CodeEditor({ value, onChange }) {
  return <AceEditor
    mode="json"
    theme="github"
    // theme="monokai"
    onChange={onChange}
    name="json-editor"
    // value={value}
    editorProps={{ $blockScrolling: true }}
    // width="100%"
    // height="100%"
  />
}

export default CodeEditor;