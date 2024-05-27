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

  const { mappingSchema } = useSectionsMapping();

  const [content, setContent] = useState("");

  useEffect(() => {
    // async function fetchAndProcess() {
    //   setLoading(true);
    //   const res = await fetchAndProcessSectionsData(templateId);
    //   setContent(JSON.stringify(res.data, null, 2));
    //   // .replace(/"(\w+)"\s*:/g, '$1:'));

    // }
    // fetchAndProcess();

    setLoading(true);
    console.log(mappingSchema);
    setContent(JSON.stringify(mappingSchema.mapping, null, 2));
  }, [templateId, mappingSchema]);

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