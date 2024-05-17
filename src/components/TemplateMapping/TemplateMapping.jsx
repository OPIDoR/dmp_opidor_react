import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";


function TemplateMapping({ locale, initialTemplateId, targetTemplateId }) {
  // --- STATE ---
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const { enableMapping, USAGE_INITIAL, USAGE_TARGET } = useSectionsMapping();
  const [height, setHeight] = useState(INNER_SCROLLING_DEFAULT_HEIGHT);
  const targetRef = useRef(null);

  const INNER_SCROLLING_DEFAULT_HEIGHT = "calc(100vh - 100px)";
  const innerScrollingFormsStyle = {
    position: "absolute",
    top: "0",
    height: height,
    maxHeight: INNER_SCROLLING_DEFAULT_HEIGHT,
    overflowY: "auto",
  };

  // --- BEHAVIOURS ---
  useEffect(() => {
    enableMapping();
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [locale]);

  /**
   * Function called when the window is scrolled.
   */
  const handleScroll = () => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const distanceFromTop = rect.top;
      const calculatedHeight = `calc(100vh - ${distanceFromTop}px)`;
      setHeight(calculatedHeight);
    }
  };

  // --- RENDER ---
  return (
    <div className="row" style={{
      height: height,
      maxHeight: INNER_SCROLLING_DEFAULT_HEIGHT,
    }}>
      <div className="col-md-6" style={innerScrollingFormsStyle}>
        <SectionsContent templateId={initialTemplateId} readonly id='left' mappingUsage={USAGE_INITIAL} />
      </div>
      <div ref={targetRef} className="col-md-6" style={{...innerScrollingFormsStyle, right: "0"}}>
        <SectionsContent templateId={targetTemplateId} id='right' hiddenFields mappingUsage={USAGE_TARGET} />
      </div>
    </div>
  );
}

export default TemplateMapping;
