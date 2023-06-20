import styled from "styled-components";

export const NavBody = styled.div`
  color: #000;
  padding: 0px;

  margin-top: 4px;
  min-height: 320px;
  max-height: 10px;
  margin-right: 20px;
`;
export const NavBodyText = styled.div`
  background: white; // Set the background color to white
  padding: 18px; // Add padding if needed
  border-radius: 0px 10px 10px 10px;
  font-family:  "Helvetica Neue", sans-serif;
  color: var(--primary);
  min-height: 300px;
`;

export const ScrollNav = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: bold;
  scrollbar-color: var(--primary) transparent;
  &::-webkit-scrollbar {
    width: 16px;
    display: flex;
    justify-content: space-between;
    background: var(--white);
    border-radius: 13px;
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

export const MainNav = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Close = styled.div`
  margin: 10px 0px 0px 0px;
  color: #fff;
  font-size: 25px;
  font-family:  "Helvetica Neue", sans-serif;
`;

export const Theme = styled.div`
  font-size: 25px;
  font-family:  "Helvetica Neue", sans-serif;
  font-weight: bold;
`;
