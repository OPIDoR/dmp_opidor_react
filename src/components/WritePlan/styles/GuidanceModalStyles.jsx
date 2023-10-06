import styled from "styled-components";

export const NavBody = styled.div`
  color: #000;
  padding: 0;
  margin: 0;
  min-height: 318px;
  max-height: 318px;
`;

export const NavBodyText = styled.div`
  background: var(--white);
  padding: 10px 5px 5px 10px;
  box-sizing: border-box;
  font-family: "Helvetica Neue", sans-serif;
  color: var(--primary);
  height: 318px;
  max-height: 318px;
  border-radius: 10px;
`;

export const ScrollNav = styled.div`
  overflow: auto;
  height: 100%;
  scrollbar-width: bold;
  scrollbar-color: var(--primary) transparent;
  &::-webkit-scrollbar {
    width: 16px;
    display: flex;
    justify-content: space-between;
    background: var(--white);
    border-radius: 0 10px 10px 0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 8px;
    border: 3px solid var(--white);
  }
`;

export const Theme = styled.div`
  font-size: 25px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: bold;
`;
