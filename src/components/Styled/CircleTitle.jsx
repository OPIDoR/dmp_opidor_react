import React from "react";
import styled from "styled-components";

const CircleContent = styled.div`
  margin: 30px;
`;

const Circle = styled.div`
  border-radius: 50%;
  width: 53px !important;
  height: 55px;
  padding: 0px;
  background: var(--rust);
  border: 3px solid var(--rust);
  color: var(--white);
  text-align: center;
  margin: 5px;
  font-size: 30px;
  font-family: tomarikDisplay;
`;

const CircleText = styled.div`
  color: var(--dark-blue);
  margin: 18px 0px 0px 5px;
  font-size: 25px;
  font-weight: bold;
`;

function CircleTitle({ number, title }) {
  return (
    <div className="row">
      <CircleContent className="row">
        <div className="row">
          <Circle className="col-md-4">{number}</Circle>
          <CircleText className="col-md-8">{title}</CircleText>
        </div>
      </CircleContent>
    </div>
  );
}

export default CircleTitle;
