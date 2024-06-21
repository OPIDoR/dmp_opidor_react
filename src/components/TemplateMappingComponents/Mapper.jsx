import React, { useRef, useState } from "react";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import CodeEditor from "./CodeEditor";
import { TemplateProvider } from "../context/TemplateContext";
import { t } from "i18next";

function Mapper({ mappingType }) {
  const targetRef = useRef(null);
  const {
    USAGE_INITIAL, USAGE_TARGET,
    editorRef,
    initialTemplateId,
    targetTemplateId,
    TYPE_FORM,
  } = useSectionsMapping();

  const INNER_SCROLLING_DEFAULT_HEIGHT = "calc(100vh - 100px)";
  const [height, setHeight] = useState(INNER_SCROLLING_DEFAULT_HEIGHT);
  const innerScrollingFormsStyle = {
    position: "absolute",
    top: "0",
    height: height,
    maxHeight: INNER_SCROLLING_DEFAULT_HEIGHT,
    overflowY: "auto",
    padding: "0 1em",
  };

  return <div className="row" style={{
    height: height,
    maxHeight: INNER_SCROLLING_DEFAULT_HEIGHT,
  }}>
    <div className="col-md-6">
      <div style={{ ...innerScrollingFormsStyle, visibility: !editorRef.current ? 'hidden' : '' }}>
        <TemplateProvider>
          <SectionsContent templateId={initialTemplateId} readonly id='left' mappingUsage={USAGE_INITIAL} />
        </TemplateProvider>
      </div>
      {!editorRef.current &&
        <p><i className="fas fa-info" /> {t('Open a question in the target template to get started.')}</p>
      }

    </div>
    <div ref={targetRef} className="col-md-6">
      <TemplateProvider>
        {mappingType === TYPE_FORM.value
          ?
          <div style={{ ...innerScrollingFormsStyle, right: "0" }}>
            <SectionsContent templateId={targetTemplateId} id='right' hiddenFields mappingUsage={USAGE_TARGET} />
          </div>
          :
          <CodeEditor templateId={targetTemplateId} ref={editorRef} />
        }
      </TemplateProvider>
    </div>
  </div>;
}

export default Mapper;