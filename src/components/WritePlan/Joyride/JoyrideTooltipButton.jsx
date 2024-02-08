import React from "react";
import styled from "styled-components";

const Link = styled.button`
  color: var(--white);
  padding: 5px;
  background: transparent;
  border: none;
  font-size: 10px;
  min-width: 90px;

  &:hover {
    filter: brightness(90%);
  }
`;

const Button = styled(Link)`
  border-radius: 8px;
  background: var(--rust);
  border: 1px solid var(--white);
  font-size: 16px;
}`;

function JoyrideTooltipButton(props) {
  const { type, style, className } = props;

  if (type?.toLowerCase() === 'link') {
    return (
      <Link
        { ...props }
        style={style}
        className={className}
      >
        {props.title}
      </Link>
    );
  }

  return (
    <Button
      { ...props }
      style={style}
      className={className}
    >
      {props.title}
    </Button>
  );
}

export default JoyrideTooltipButton;
