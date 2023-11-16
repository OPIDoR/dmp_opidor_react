import React from "react";
import styled from "styled-components";

const Button = styled.button`
  padding: 10px 20px 10px 20px;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${(props) => (props.$buttonColor === "primary" ? "var(--dark-blue)" : "var(--rust)")} !important;
  border-color: ${(props) => (props.$buttonColor === "primary" ? "var(--dark-blue)" : "var(--rust)")} !important;
  transition: ease-in-out 0.2s;

  &:hover {
    background-color: var(--dark-blue) !important;
    border-color: var(--dark-blue) !important;
  }
`;

const DivButton = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$position || "start") };
`;

/**
 * This is a React component that renders a custom button with customizable properties such as title, type, and position.
 * @returns A React functional component that renders a custom button with customizable properties such as handleClick, title, type, and position. The
 * button is styled using CSS-in-JS with the help of the styled-components library. The component returns a div that contains a button element with an
 * onClick event listener that triggers the handleClick function passed as a prop.
 */
function CustomButton({ handleClick, title, buttonType = 'button', buttonColor, position, disabled }) {
  const handleButtonAction = (e) => {
    handleClick?.(e);
  };

  return (
    <DivButton $position={position}>
      <Button type={buttonType} className="btn btn-primary" $buttonType={buttonColor} onClick={handleButtonAction} disabled={disabled}>
        {title}
      </Button>
    </DivButton>
  );
}

export default CustomButton;
