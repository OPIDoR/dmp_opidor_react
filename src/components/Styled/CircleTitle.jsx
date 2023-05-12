import React from "react";
import styled from "styled-components";

function CircleTitle({ number, title }) {
  const CircleContent = styled.div`
    margin: 30px;
  `;
  const Circle = styled.div`
    border-radius: 50%;
    width: 53px !important;
    height: 55px;
    padding: 0px;
    background: var(--orange);
    border: 3px solid var(--orange);
    color: var(--white);
    text-align: center;
    margin: 5px;
    font-size: 30px;
    font-family: tomarikDisplay;
  `;
  const CircleText = styled.div`
    color: var(--primary);
    margin: 18px 0px 0px 5px;
    font-size: 25px;
    font-weight: bold;
  `;

  return (
    <div className="row">
      <CircleContent className="row">
        <div className="rom">
          <Circle className="col-md-4">{number}</Circle>
          <CircleText className="col-md-8 ">{title}</CircleText>
        </div>
      </CircleContent>
    </div>
  );
}

export default CircleTitle;
