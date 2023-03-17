import DOMPurify from "dompurify";
import React, { useState } from "react";
import styled from "styled-components";

function ModalRecommandation({ show, setshowModalRecommandation, setFillColorBell }) {
  const [activeTab, setActiveTab] = useState("Science Europe");

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
      border-radius: 3px;
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
  `;

  const getContent = () => {
    switch (activeTab) {
      case "Science Europe":
        return (
          <ScrollNav>
            <NavBody>
              <NavBodyText>
                <div
                  style={{
                    wordBreak: "break-word", // Add this line to break the long text
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(`<div>eur à faire son choix.
                    Formulaire standard (description des données)
                    CONTACT
                    SUPPORT
                    TECHNIQUE
                    Science Europe INRAE DCC IRD LMU
                    ◦ Donnez des détails sur le type de données : par exemple 
                    numérique (bases de données, tableurs), textuel (documents), 
                    image, audio, vidéo, et/ou médias composites.
                    ◦ Expliquez comment les données pourraient être réutilisées 
                    dans d’autres contextes. Les identifiants persistants (PID) 
                    devraient être appliqués de manière à ce que les données ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd dddddddddddddddddddddddddddddddddddddddd
                    puissent être localisées et référencées de façon fiable et efficace. Ces PID aident aussi à comptabiliser les citations et les 
                    réutilisations.
                    ◦ Indiquez s’il sera envisagé d’attribuer aux données un PID. 
                    Typiquement, un entrepôt pérenne digne de confiance attribuera des identifiants persistants</div>`),
                  }}
                />
              </NavBodyText>
            </NavBody>
          </ScrollNav>
        );
      case "INRAE":
        return (
          <ScrollNav>
            <NavBody>
              <NavBodyText>
                <div
                  style={{
                    wordBreak: "break-word", // Add this line to break the long text
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      "<div>ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8888888888888888888888888888888888888888888888888888888888888888888888888888</div>"
                    ),
                  }}
                />
              </NavBodyText>
            </NavBody>
          </ScrollNav>
        );
      case "DCC":
        return (
          <ScrollNav>
            <NavBody>
              <NavBodyText>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize("<p>dddddddd</p>"),
                  }}
                />
              </NavBodyText>
            </NavBody>
          </ScrollNav>
        );
      case "IRD":
        return (
          <ScrollNav>
            <NavBody>
              <NavBodyText>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize("<p>dddddddd</p>"),
                  }}
                />
              </NavBodyText>
            </NavBody>
          </ScrollNav>
        );
      case "LMU":
        return (
          <ScrollNav>
            <NavBody>
              <NavBodyText>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize("<p>dddddddd</p>"),
                  }}
                />
              </NavBodyText>
            </NavBody>
          </ScrollNav>
        );
      default:
        return null;
    }
  };

  return (
    <div style={modalStyles}>
      <MainNav>
        <nav style={navBar}>
          {["Science Europe", "INRAE", "DCC", "IRD", "LMU"].map((el, idx) => (
            <span
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveTab(el);
              }}
              style={navStyles(el)}
            >
              {el}
            </span>
          ))}
        </nav>
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

      <div>{getContent()}</div>
    </div>
  );
}

export default ModalRecommandation;
