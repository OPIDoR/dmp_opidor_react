import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { getGuidance } from "../../services/DmpGuidanceApi";
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import { NavBody, NavBodyText, ScrollNav, MainNav, Close, Theme } from "./styles/GuidanceModalStyles";

function GuidanceModal({ show, setShowGuidanceModal, setFillColorGuidanceIcon, questionId }) {
  const [activeTab, setActiveTab] = useState("Science Europe");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [indexTab, setIndexTab] = useState(0);

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
    // overflow: "auto", // Add thi
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
    // fontFamily:'"Helvetica Neue", sans-serif',
    // fontSize: "15px",
  });

  const navBar = {
    marginTop: "10px",
    display: "flex",
  };

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    if (questionId) {
      setLoading(true);
      getGuidance(questionId, "")
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [questionId]);

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
            {data?.[indexTab]?.annotations[0]?.text ? (
              <div
                key={`annotation-${indexTab}`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data?.[indexTab]?.annotations[0]["text"]),
                }}
              />
            ) : (
              <>
                {data?.[indexTab].groups.map((el, idx) => (
                  <>
                    <Theme key={`theme-${idx}`}>{el?.theme}</Theme>
                    {el?.guidances.map((g, id) => (
                      <>
                        <div
                          key={`guidance-${id}`}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(g.text),
                          }}
                        />
                        <hr key={`hr-${id}`} />
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
                key={`tab-${idx}`}
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
