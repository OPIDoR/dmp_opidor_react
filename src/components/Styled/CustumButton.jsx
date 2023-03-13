import styled from "styled-components";

import React from "react";

function CustumButton({ handleNextStep, title, type }) {
  // const Button = styled.button`
  //   margin: 30px 0px 10px 0px;
  //   background-color: var(--orange) !important;
  //   border-color: var(--orange) !important;
  // `;

  const Button =
    type === "primary"
      ? styled.button`
          margin: 30px 0px 10px 0px;
          margin: 10px;
        `
      : styled.button`
          margin: 30px 0px 10px 0px;
          margin: 10px;
          background-color: var(--orange) !important;
          border-color: var(--orange) !important;
        `;

  const handleClick = () => {
    handleNextStep();
  };
  return (
    <Button type="button" className="btn btn-primary" onClick={handleClick}>
      {title}
    </Button>
  );
}

export default CustumButton;
