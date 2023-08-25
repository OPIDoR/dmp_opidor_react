import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { getGuidance } from "../../services/DmpGuidanceApi";
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import { NavBody, NavBodyText, ScrollNav, MainNav, Close, Theme } from "./styles/GuidanceModalStyles";

function GuidanceModal({ show, setshowModalRecommandation, setFillColorIconRecommandation, questionId }) {
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
    setLoading(true);
    getGuidance(questionId, "")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [questionId]);

  /* `getContent` is a function that returns JSX code. It creates a scrollable container (`<ScrollNav>`) that contains a body (`<NavBody>`) and text
(`<NavBodyText>`). The text content is determined by the `data` state variable and the `indexTab` state variable. If
`data[indexTab].annotations[0].text` exists, it is displayed using `dangerouslySetInnerHTML` to sanitize and render the HTML content. Otherwise, the
function maps through the `data[indexTab].groups` array to display each group's `theme` and `guidances` using `dangerouslySetInnerHTML` to sanitize
and render the HTML content. A horizontal line (`<hr>`) is added between each guidance. */
  const getContent = () => {
    return (
      <ScrollNav>
        <NavBody>
          <NavBodyText>
            {data?.[indexTab]?.annotations[0]?.text ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data?.[indexTab]?.annotations[0]["text"]),
                }}
              />
            ) : (
              <>
                {data?.[indexTab].groups.map((el) => (
                  <>
                    <Theme>{el?.theme}</Theme>
                    {el?.guidances.map((g) => (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(g.text),
                          }}
                        />
                        <hr></hr>
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
        {loading && <CustomSpinner></CustomSpinner>}
        {!loading && error && <CustomError error={error}></CustomError>}
        {!loading && !error && data && (
          <nav style={navBar}>
            {data.map((el, idx) => (
              <span
                key={idx}
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
            setshowModalRecommandation(false);
            setFillColorIconRecommandation("var(--primary)");
          }}
        >
          x
        </Close>
      </MainNav>
      <div>{data && getContent()}</div>
    </div>
  );
}

export default GuidanceModal;
