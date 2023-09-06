import styled from "styled-components";

export const NavBody = styled.div`
  color: #000;
  padding: 0px;
  margin-top: 4px;
  min-height: 320px;
  margin-right: 20px;
`;

export const NavBodyText = styled.div`
  background: white; // Set the background color to white
  padding: 18px 18px 5px 18px; // Add padding if needed
  border-radius: 10px;
  margin: 10px;
  font-family:  "Helvetica Neue", sans-serif;
  color: var(--primary);
`;

export const Title = styled.div`
  margin: 10px 0px 0px 30px;
  color: #fff;
  font-size: 20px;
  font-family:  "Helvetica Neue", sans-serif;
`;

export const ScrollNav = styled.div`
  max-height: 209px;
  overflow: auto;
  overflow-anchor: none;
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
  margin: 0px 21px 12px 0px;
  color: #fff;
  font-size: 25px;
`;

export const ButtonComment = styled.button`
  margin: 10px 2px 2px 0px;
  color: #000;
  font-size: 18px;
  color: var(--primary) !important;
  font-family: "Helvetica Neue", sans-serif !important;
  border-radius: 8px !important;
`;

export const CommentsCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px 0px 10px;
`;
