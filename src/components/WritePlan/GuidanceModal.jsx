import DOMPurify from "dompurify";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { GlobalContext } from "../context/Global";
import { guidances } from "../../services";
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import { NavBody, NavBodyText, ScrollNav, Theme, SubTitle } from "./styles/GuidanceModalStyles";
import InnerModal from "../Shared/InnerModal/InnerModal";

function GuidanceModal({ show, setShowGuidanceModal, setFillColorGuidanceIcon, questionId, planId }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Science Europe');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [indexTab, setIndexTab] = useState(0);
  const modalRef = useRef(null);
  const [guidancesGroups, setGuidancesGroups] = useState({});

  const {
    questionsWithGuidance,
  } = useContext(GlobalContext);

  const navStyles = (tab) => ({
    color: activeTab === tab ? 'var(--white)' : 'var(--dark-blue)',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: activeTab === tab ? 'var(--dark-blue)' : 'var(--white)',
    border: activeTab === tab ? '1px solid var(--dark-blue)' : '1px solid var(--white)',
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
    guidances.getGuidanceGroups(planId)
      .then((res) => setGuidancesGroups(
        res?.data?.data?.flatMap((groups) => groups.guidance_groups.flatMap((group) => group))
          ?.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.name }), {}),
      ))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

    guidances.getGuidances(planId, questionId)
      .then(({ data }) => {
        const guidancesData = data?.guidances;
        guidancesData[0].annotations = [
          {
            "id": 33791,
            "question_id": 34,
            "org_id": 1,
            "text": "<p>Se r&eacute;f&eacute;rer aux recommandations du Service Protection des Donn&eacute;es du CNRS pour le traitement des donn&eacute;es &agrave; caract&egrave;re personnel.</p>",
            "type": "guidance",
            "created_at": "2024-03-12T08:27:39.587Z",
            "updated_at": "2024-03-12T08:27:39.587Z",
            "versionable_id": "ebb75c04-681a-4edd-affa-0cc029f9bf02"
          }
        ]
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
        <NavBodyText>
          <ScrollNav>
            {data?.[indexTab]?.annotations?.length > 0 && (
              <>
                {data?.[indexTab]?.annotations?.map((annotation, id) => (
                  <div
                    key={`guidance-${indexTab}-annotation-${id}`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(annotation.text),
                    }}
                  />
                ))}
              </>
            )}
            {
              Object.keys(data?.[indexTab]?.groups).length > 0 && (
                <>
                  {
                    Object.keys(data?.[indexTab]?.groups).map((ref, idx) => (
                      <div key={`guidance-ref-${ref}-${idx}`}>
                        {Object.keys(data?.[indexTab]?.groups?.[ref]).map((theme, themeId) => (
                          <div key={`guidance-theme-${themeId}`}>
                            {idx === 0 && <Theme alt={theme}>{theme}</Theme>}
                            {data?.[indexTab]?.groups?.[ref]?.[theme]?.map((g, id) => (
                              <div key={`guidance-theme-${themeId}-id-${id}-content`}>
                                <SubTitle>{guidancesGroups[g.guidance_group_id]}</SubTitle>
                                <div
                                  key={`guidance-theme-${themeId}-id-${id}`}
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(g.text),
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                  ))
                  }
                </>
              )
            }
          </ScrollNav>
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
          {t('Guidance')}
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
                  style={{
                    ...navStyles(el.name),
                    width: `calc(100% / ${data.length})`,
                    borderTop: indexTab === idx ? null : '1px solid var(--dark-blue)',
                    borderLeft: indexTab === idx ? null : '1px solid var(--dark-blue)',
                    borderRight: indexTab === idx ? null : '1px solid var(--dark-blue)',
                  }}
                  alt={el.name}
                >
                  <ReactTooltip
                    key={`guidance-tab-tooltip-${idx}`}
                    id={`guidance-tab-title-${idx}`}
                    place="bottom"
                    effect="solid"
                    variant="info"
                    content={el.name}
                  />
                  <span
                    key={`guidance-tab-title-${idx}`}
                    data-tooltip-id={`guidance-tab-title-${idx}`}
                    alt={el.name}
                  >
                    {el.name.length < 15 ? el.name : `${el.name.substring(0, 15)}...`}
                  </span>
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
