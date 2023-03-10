import styled from "styled-components";

import React from "react";

function Button({ handleNextStep, title }) {
  const Button = styled.button`
    margin: 30px 0px 10px 0px;
    background-color: var(--orange) !important;
    border-color: var(--orange) !important;
  `;
  const handleClick = () => {
    handleNextStep();
  };
  return (
    <Button type="button" className="btn btn-primary validate" onClick={handleClick}>
      {title}
    </Button>
  );
}

export default Button;
