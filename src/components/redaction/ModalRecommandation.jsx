import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getRecommandation } from "../../services/DmpRecommandationApi";
import CustumSpinner from "../Shared/CustumSpinner";

function ModalRecommandation({ show, setshowModalRecommandation, setFillColorBell }) {
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
    marginLeft: "-771px",
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
    // fontFamily: "custumHelveticaLight",
    // fontSize: "15px",
  });

  const navBar = {
    marginTop: "10px",
    display: "flex",
  };

  const NavBody = styled.div`
    color: #000;
    padding: 0px;

    margin-top: 4px;
    min-height: 320px;
    max-height: 10px;
    margin-right: 20px;
  `;
  const NavBodyText = styled.div`
    background: white; // Set the background color to white
    padding: 18px; // Add padding if needed
    border-radius: 0px 10px 10px 10px;
    font-family: custumHelveticaLight;
    color: var(--primary);
    min-height: 300px;
  `;

  const ScrollNav = styled.div`
    overflow: auto;
    scrollbar-width: bold;
    scrollbar-color: var(--primary) transparent;
    &::-webkit-scrollbar {
      width: 16px;
      display: flex;
      justify-content: space-between;
      background: var(--white);
      border-radius: 13px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--primary);
      border-radius: 8px;
      border: 3px solid var(--white);
    }
  `;

  const MainNav = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  const Close = styled.div`
    margin: 10px 0px 0px 0px;
    color: #fff;
    font-size: 25px;
    font-family: custumHelveticaLight;
  `;

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    setLoading(true);
    getRecommandation("", "")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  const getContent = () => {
    return (
      <ScrollNav>
        <NavBody>
          <NavBodyText>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data?.[indexTab]?.description),
              }}
            />
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
        {loading && <CustumSpinner></CustumSpinner>}
        {!loading && error && <p>error</p>}
        {!loading && !error && data && (
          <nav style={navBar}>
            {data.map((el, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveTab(el.titre);
                  setIndexTab(idx);
                }}
                style={navStyles(el.titre)}
              >
                {el.titre}
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
            setFillColorBell("var(--primary)");
          }}
        >
          x
        </Close>
      </MainNav>

      <div>{data && getContent()}</div>
    </div>
  );
}

export default ModalRecommandation;
