import React from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.3);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
`;

const Beacon = styled.button`
  animation: ${pulse} 1s ease-in-out infinite;
  background-color: var(--rust);
  opacity: 0.7;
  border: 0;
  border-radius: 50%;
  display: inline-block;
  height: 3rem;
  width: 3rem;
`;

function JoyrideBeacon(props) {
  return (<Beacon { ...props } />);
};

export default JoyrideBeacon;
