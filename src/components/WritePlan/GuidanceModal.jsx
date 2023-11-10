import DOMPurify from "dompurify";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../context/Global";
import { guidances } from "../../services";
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import { NavBody, NavBodyText, ScrollNav, Theme } from "./styles/GuidanceModalStyles";
import InnerModal from "../Shared/InnerModal/InnerModal";

function GuidanceModal({ show, setShowGuidanceModal, setFillColorGuidanceIcon, questionId, planId }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Science Europe');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [indexTab, setIndexTab] = useState(0);
  const modalRef = useRef(null);

  const {
    questionsWithGuidance,
  } = useContext(GlobalContext);

  const navStyles = (tab) => ({
    color: activeTab === tab ? 'var(--dark-blue)' : 'var(--white)',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    background: activeTab === tab ? 'var(--white)' : 'var(--dark-blue)',
    padding: '10px',
    borderRadius: '10px 10px 0 0',
    fontWeight: 'bold',
    margin: '0 0 1px 0',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if (!questionId) { return; }
    if (!questionsWithGuidance.includes(questionId)) { return; }

    setLoading(true);
    guidances.getGuidances(planId, questionId)
      .then(({ data }) => {
        const guidancesData = data?.guidances;
        setData(guidancesData);
        const activetab = guidancesData?.[0]?.name || '';
        setActiveTab(activetab);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [planId, questionId]);

  /**
  * getContent function returns JSX with a scrollable container (<ScrollNav>) containing a body (<NavBody>) and text (<NavBodyText>).
  * Text is based on data and indexTab. If data[indexTab].annotations[0].text exists, it's displayed using dangerouslySetInnerHTML for HTML rendering.
  * Otherwise, the function maps data[indexTab].groups to show each group's theme and guidances using dangerouslySetInnerHTML.
  * Horizontal lines (<hr>) separate each guidance.
  */
  const getContent = () => {
    return (
      <NavBody>
        <NavBodyText style={{ borderRadius: '10px' }}>
          {data?.[indexTab]?.annotations?.length > 0 ? (
            <>
              {data?.[indexTab]?.annotations?.map((annotation, id) => (
                <ScrollNav
                  key={`guidance-${indexTab}-annotation-${id}`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(annotation.text),
                  }}
                />
              ))}
            </>
          ) : (
            <>
              {Object.keys(data?.[indexTab]?.groups).length > 0 &&
                Object.keys(data?.[indexTab]?.groups).map((ref, idx) => (
                  <ScrollNav key={`guidance-scroll-nav-${ref}-${idx}`}>
                    <div key={`guidance-ref-${ref}-${idx}`}>
                      {Object.keys(data?.[indexTab]?.groups?.[ref]).map((theme, themeId) => (
                        <div key={`guidance-theme-${themeId}`}>
                          <Theme alt={theme}>{theme}</Theme>
                          {data?.[indexTab]?.groups?.[ref]?.[theme]?.map((g, id) => (
                            <div key={`guidance-theme-${themeId}-id-${id}-content`}>
                              <div
                                key={`guidance-theme-${themeId}-id-${id}`}
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(g.text),
                                }}
                              />
                              {id > 0 && <hr key={`guidance-hr-${themeId}`} />}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </ScrollNav>
                ))}
            </>
          )}
        </NavBodyText>
      </NavBody>
    );
  };

  return (
    <InnerModal show={show} ref={modalRef}>
      <InnerModal.Header
        closeButton
        expandButton
        ref={modalRef}
        onClose={() => {
          setShowGuidanceModal(false);
          setFillColorGuidanceIcon("var(--dark-blue)");
        }}
      >
        <InnerModal.Title>
          {t('Guidances')}
        </InnerModal.Title>
      </InnerModal.Header>
      <InnerModal.Body>
        {loading && <CustomSpinner />}
        {!loading && error && <CustomError error={error} />}
        {!loading && !error && data && (
          <>
            <nav style={{ display: 'flex', width: '100%', padding: '0 10px 0 10px' }} id="guidances-thumbs">
              {data.map((el, idx) => (
                <span
                  key={`guidance-tab-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setActiveTab(el.name);
                    setIndexTab(idx);
                  }}
                  style={{ ...navStyles(el.name), width: `calc(100% / ${data.length})` }}
                  alt={el.name}
                >
                  {el.name.length < 15 ? el.name : `${el.name.substring(0, 15)}...`}
                </span>
              ))}
            </nav>
            <div id="guidances-content">{data && getContent()}</div>
          </>
        )}
      </InnerModal.Body>
    </InnerModal>
  );
}

export default GuidanceModal;
