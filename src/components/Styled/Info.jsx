import styled from "styled-components";
import React from "react";

const Icon = styled.a`
  font-size: 20px;
`;

const Text = styled.span`
  margin-left: 15px;
  font-size: 16px;
`;

function Info({ text, icon, type }) {
  const AlertContainer =
    type === "info"
      ? styled.div`
          margin: 0px 0px 0px -360px;
          background-color: var(--primary);
          padding: 10px;
          border-radius: 8px;
          z-index: 999;
          color: var(--white);
        `
      : styled.div`
          text-align: start;
          margin: 10px 0px 10px 30px;
          background-color: var(--orange);
          width: 62%;
          padding: 10px;
          border-radius: 8px;
        `;

  const IconColor =
    type === "info"
      ? styled.a`
          color: var(--white);
          font-size: 20px;
        `
      : styled.a`
          color: var(--yellow);
          font-size: 20px;
        `;

  return (
    <AlertContainer type={type}>
      <span>
        <IconColor>
          <i className={icon} />
        </IconColor>
      </span>
      <Text>{text}</Text>
    </AlertContainer>
  );
}

export default Info;
