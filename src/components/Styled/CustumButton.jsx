import React from "react";
import styled from "styled-components";

function CustumButton({ handleClick, title, type, position }) {
  const Button =
    type === "primary"
      ? styled.button`
          margin: 30px 0px 10px 0px;
          margin: 10px;
          padding: 10px 20px 10px 20px;
          border-radius: 10px;
          font-size: 15px;
        `
      : styled.button`
          margin: 30px 0px 10px 0px;
          margin: 10px;
          background-color: var(--orange) !important;
          border-color: var(--orange) !important;
          padding: 10px 20px 10px 20px;
          border-radius: 10px;
          font-size: 15px;
        `;

  const DivButton =
    position === "start"
      ? styled.div`
          display: flex;
          justify-content: start;
        `
      : styled.div`
          display: flex;
          justify-content: center;
        `;
  const handleButtonAction = (e) => {
    handleClick(e);
  };
  return (
    <DivButton>
      <Button type="button" className="btn btn-primary" onClick={handleButtonAction}>
        {title}
      </Button>
    </DivButton>
  );
}

export default CustumButton;
