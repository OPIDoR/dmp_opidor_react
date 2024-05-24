import React, { useEffect, useState } from "react";
import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";
import useTemplate from "../../hooks/useTemplate";

function CodeEditor({ templateId, onChange }) {

  const { setLoading, fetchAndProcessSectionsData } = useTemplate();

  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchAndProcess() {
      setLoading(true);
      const res = await fetchAndProcessSectionsData(templateId);
      setContent(JSON.stringify(res.data, null, 2));
        // .replace(/"(\w+)"\s*:/g, '$1:'));
      }

    fetchAndProcess();
  }, [templateId]);

  return <AceEditor
    mode="json"
    theme="github"
    // theme="monokai"
    onChange={onChange}
    name="json-editor"
    value={content}
    editorProps={{ $blockScrolling: true }}
    width="40vw"
    // height="100%"
  />
}

export default CodeEditor;