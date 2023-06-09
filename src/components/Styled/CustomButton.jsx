import React from "react";
import styled from "styled-components";

const Button = styled.button`
  margin: 30px 0px 10px 0px;
  margin: 10px;
  padding: 10px 20px 10px 20px;
  border-radius: 10px;
  font-size: 15px;
  background-color: ${(props) => (props.buttonType === "primary" ? "var(--primary) !important" : "var(--orange) !important")};
  border-color: ${(props) => (props.buttonType === "primary" ? "var(--primary) !important" : "var(--orange) !important")};
`;

const DivButton = styled.div`
  display: flex;
  justify-content: ${(props) => (props.position === "start" ? "start" : "center") };
`;
/**
 * This is a React component that renders a custom button with customizable properties such as title, type, and position.
 * @returns A React functional component that renders a custom button with customizable properties such as handleClick, title, type, and position. The
 * button is styled using CSS-in-JS with the help of the styled-components library. The component returns a div that contains a button element with an
 * onClick event listener that triggers the handleClick function passed as a prop.
 */
function CustomButton({ handleClick, title, buttonType, position }) {
  const handleButtonAction = (e) => {
    handleClick(e);
  };

  return (
    <DivButton position={position}>
      <Button type="button" className="btn btn-primary" buttonType={buttonType}  onClick={handleButtonAction}>
        {title}
      </Button>
    </DivButton>
  );
}

export default CustomButton;
