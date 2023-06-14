import React from "react";
import styled from "styled-components";

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${({ type }) => (type === "primary" ? "var(--secondary)" : "var(--orange)")};
  border-color: ${({ type }) => (type === "primary" ? "var(--secondary)" : "var(--orange)")};
`;

const DivButton = styled.div`
  display: flex;
  justify-content: ${({ position }) => (position === "start" ? "start" : "center")};
`;

function CustomButton({ handleClick, title, type, position }) {
  const handleButtonAction = (e) => {
    handleClick(e);
  };

  return (
    <DivButton position={position}>
      <Button type={type} className="btn btn-primary" onClick={handleButtonAction}>
        {title}
      </Button>
    </DivButton>
  );
}

export default CustomButton;
