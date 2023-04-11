import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getRecommandation } from "../../services/DmpRecommandationApi";
import CustomSpinner from "../Shared/CustomSpinner";

function ModalRuns({ show, setshowModalRuns, setFillColorIconRuns }) {
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
    padding: "0px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginLeft: "-725px",
    marginTop: "410px",
    width: "550px",
    height: "380px",
    color: "var(--white)",
    // overflow: "auto", // Add thi
  };

  const ButtonComment = styled.button`
    margin: 10px 2px 2px 0px;
    color: #000;
    font-size: 18px;
    color: var(--primary) !important;
    font-family: custumHelveticaLight !important;
    border-radius: 8px !important;
  `;

  const NavBody = styled.div`
    color: #000;
    padding: 0px;
    margin-top: 4px;
    min-height: 320px;
    max-height: 10px;
    margin-right: 20px;
  `;
  const NavBodyText = styled.div`
    padding: 0px 0px 0px 18px; // Add padding if needed
    border-radius: 0px 10px 10px 10px;
    font-family: custumHelveticaLight;
    color: var(--primary);
    min-height: 300px;
  `;

  const MainNav = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  const Close = styled.div`
    margin: 8px 8px 0px 0px;
    color: #fff;
    font-size: 25px;
    font-family: custumHelveticaLight;
  `;

  const Title = styled.div`
    margin: 10px 0px 0px 30px;
    color: #fff;
    font-size: 20px;
    font-family: custumHelveticaLight;
  `;

  const Description = styled.div`
    margin: 10px 0px 0px 10px;
    color: #fff;
    font-size: 16px;
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

  return (
    <div
      style={modalStyles}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <MainNav>
        <div></div>
        <Close
          className="close"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setshowModalRuns(false);
            setFillColorIconRuns("var(--primary)");
          }}
        >
          x
        </Close>
      </MainNav>
      <NavBody>
        <Title>Runs</Title>
        <NavBodyText>
          <div style={{ margin: 10 }}>
            <ButtonComment className="btn btn-light">Calculer le coût de stockage</ButtonComment>
          </div>
          <Description>
            Les tarifs de stockage (en HT) du mésocentre sont soumis aux conditions générales de vente de l’Université de Montpellier : adresse URL
          </Description>

          <div style={{ margin: 10 }}>
            <ButtonComment className="btn btn-light">Notifier MESO@LR</ButtonComment>
          </div>
          <Description>
            Les tarifs de stockage (en HT) du mésocentre sont soumis aux conditions générales de vente de l’Université de Montpellier : adresse URL
          </Description>
        </NavBodyText>
      </NavBody>
    </div>
  );
}

export default ModalRuns;
