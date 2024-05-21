import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SectionsContent from "../Shared/SectionsContent/SectionsContent";
import { GlobalContext } from "../context/Global";
import useSectionsMapping from "../../hooks/useSectionsMapping";
import SelectSingleList from "../FormComponents/SelectSingleList";
import { FormProvider, useForm } from "react-hook-form";


function TemplateMapping({ data, locale, initialTemplateId, targetTemplateId }) {
  // --- STATE ---
  const { i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const { enableMapping, USAGE_INITIAL, USAGE_TARGET } = useSectionsMapping();
  const methods = useForm({ defaultValues: data });
  const targetRef = useRef(null); 
  
  const INNER_SCROLLING_DEFAULT_HEIGHT = "calc(100vh - 100px)";
  const [height, setHeight] = useState(INNER_SCROLLING_DEFAULT_HEIGHT);
  const innerScrollingFormsStyle = {
    position: "absolute",
    top: "0",
    height: height,
    maxHeight: INNER_SCROLLING_DEFAULT_HEIGHT,
    overflowY: "auto",
    marginTop: "100px",
    padding: "0 1em",
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
      const calculatedHeight = `calc(100vh - ${distanceFromTop + 100}px)`;
      setHeight(calculatedHeight);
    }
  };

  // --- RENDER ---
  return (
    <>
      <h1>Template Mapping</h1>
      <p>Here you can map the sections of the initial template to the sections of the target template.</p>
      <div className="row">
        <FormProvider {...methods} >
          <div className="col-md-6">
            <h2>Initial Template</h2>
            {/* <SelectSingleList
              key={"bla"}
              label={"test"}
              formLabel={"test0"}
              propName={"bla"}
              // tooltip={tooltip}
              // registries={registries}
              // registryType={registryType}
              // templateName={prop.template_name || prop.items?.template_name}
              defaultValue={"rrrrr"}
              // overridable={prop["overridable"]}
              // readonly={false}
            /> */}
          </div>
          <div ref={targetRef} className="col-md-6">
            <h2>Target Template</h2>

          </div>
        </FormProvider>
      </div>
      <div className="row" style={{
        height: height,
        maxHeight: INNER_SCROLLING_DEFAULT_HEIGHT,
      }}>
        <div className="col-md-6">
          {/* <h2>Initial Template</h2>
          <SelectSingleList /> */}
          <div style={innerScrollingFormsStyle}>
            <SectionsContent templateId={initialTemplateId} readonly id='left' mappingUsage={USAGE_INITIAL} />
          </div>
        </div>
        <div ref={targetRef} className="col-md-6">
          {/* <h2>Target Template</h2> */}
          <div style={{...innerScrollingFormsStyle, right: "0"}}>
            <SectionsContent templateId={targetTemplateId} id='right' hiddenFields mappingUsage={USAGE_TARGET} />
          </div>
        </div>
      </div>
    </>
  );
}

export default TemplateMapping;
