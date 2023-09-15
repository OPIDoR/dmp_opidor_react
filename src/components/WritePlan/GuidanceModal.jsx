import DOMPurify from "dompurify";
import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { GlobalContext } from "../context/Global";
import { guidances } from "../../services";
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import { NavBody, NavBodyText, ScrollNav, MainNav, Close, Theme } from "./styles/GuidanceModalStyles";

function GuidanceModal({ show, setShowGuidanceModal, setFillColorGuidanceIcon, questionId, planId }) {
  const [activeTab, setActiveTab] = useState("Science Europe");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [indexTab, setIndexTab] = useState(0);
  const {
    questionsWithGuidance
  } = useContext(GlobalContext);

  const modalStyles = {
    display: show ? "block" : "none",
    position: "absolute",
    zIndex: 99,
    background: "var(--primary)",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginLeft: "-785px",
    marginTop: "388px",
    width: "600px",
    height: "400px",
    color: "var(--white)",
  };

  const navStyles = (tab) => ({
    color: activeTab === tab ? "var(--primary)" : "var(--white)",
    textDecoration: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    background: activeTab === tab ? "var(--white)" : "var(--primary)",
    padding: "10px",
    borderRadius: "10px 10px 0px 0px",
    fontWeight: "bold",
  });

  const navBar = {
    marginTop: "10px",
    display: "flex",
  };

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
   if (!questionId) { return; }
   if (!questionsWithGuidance.includes(questionId)) { return; }

    setLoading(true);
    guidances.getGuidances(planId, questionId)
      .then((res) => {
        setData(res.data.guidances);
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
      <ScrollNav>
        <NavBody>
          <NavBodyText>
            {data?.[indexTab]?.annotations?.[0]?.text ? (
              <div
                key={`guidance-annotation-${indexTab}`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data?.[indexTab]?.annotations?.[0]["text"]),
                }}
              />
            ) : (
              <>
                {Object.keys(data?.[indexTab]?.groups).map((theme, idx) => (
                  <>
                    <Theme key={`guidance-theme-${idx}`} alt={theme}>{theme}</Theme>
                    {data?.[indexTab].groups[theme]?.map((g, id) => (
                      <>
                        <div
                          key={`guidance-content-${id}`}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(g.text),
                          }}
                        />
                        {id > 0 && <hr key={`guidance-hr-${id}`} />}
                      </>
                    ))}
                  </>
                ))}
              </>
            )}
          </NavBodyText>
        </NavBody>
      </ScrollNav>
    );
  };

  return (
    <div
      style={modalStyles}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <MainNav>
        {loading && <CustomSpinner />}
        {!loading && error && <CustomError error={error} />}
        {!loading && !error && data && (
          <nav style={navBar}>
            {data.map((el, idx) => (
              <span
                key={`guidance-tab-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveTab(el.name);
                  setIndexTab(idx);
                }}
                style={navStyles(el.name)}
              >
                {el.name}
              </span>
            ))}
          </nav>
        )}
        <Close
          className="close"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowGuidanceModal(false);
            setFillColorGuidanceIcon("var(--primary)");
          }}
          key="closeModal"
        >
          <IoClose size={24} />
        </Close>
      </MainNav>
      <div>{data && getContent()}</div>
    </div>
  );
}

export default GuidanceModal;
