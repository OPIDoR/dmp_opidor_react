import React, { useContext } from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { GlobalContext } from "../context/Global";
import { useTranslation } from "react-i18next";

const EndButton = styled.div`
  display: flex;
  justify-content: end;
`;

function ImportSearchProduct() {
  const { lng } = useContext(GlobalContext);
  const { t } = useTranslation();
  return (
    <EndButton>
      <Button variant="secondary" style={{ marginRight: "8px" }}>
        {t("Fermer")}
      </Button>
      <Button variant="outline-primary" style={{ backgroundColor: "var(--orange)", color: "white" }}>
        {t("Ajouter")}
      </Button>
    </EndButton>
  );
}

export default ImportSearchProduct;
