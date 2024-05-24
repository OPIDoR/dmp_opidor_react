import React, { useEffect, useRef, useState } from "react";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import CodeEditor from "./CodeEditor";

function Mapper({ initialTemplateId, targetTemplateId, mappingType }) {
  const targetRef = useRef(null);
  const { USAGE_INITIAL, USAGE_TARGET } = useSectionsMapping();

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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });


  const handleScroll = () => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const distanceFromTop = rect.top;
      const calculatedHeight = `calc(100vh - ${distanceFromTop}px)`;
      setHeight(calculatedHeight);
    }
  };


  return <div className="row" style={{
    height: height,
    maxHeight: INNER_SCROLLING_DEFAULT_HEIGHT,
  }}>
    <div className="col-md-6">
      <div style={innerScrollingFormsStyle}>
        <SectionsContent templateId={initialTemplateId} readonly id='left' mappingUsage={USAGE_INITIAL} />
      </div>
    </div>
    <div ref={targetRef} className="col-md-6">
      {mappingType === 'formToForm'
        ?
        <div style={{ ...innerScrollingFormsStyle, right: "0" }}>
          <SectionsContent templateId={targetTemplateId} id='right' hiddenFields mappingUsage={USAGE_TARGET} />
        </div>
        :
        <CodeEditor />
      }
    </div>
  </div>;
}

export default Mapper;