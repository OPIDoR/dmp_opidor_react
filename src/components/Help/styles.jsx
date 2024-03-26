import styled from 'styled-components';

export const FaqContainer = styled.div`
  color: var(--dark-blue);
  width: 100%;
  display: flex;
  align-items: flex-start;
`;

export const FaqCategories = styled.div`
  width: 350px;
  color: var(--dark-blue);
`;

export const StyledUl = styled.ul`
  list-style-type: none;
`;

export const StyledLi = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  color: var(--white);
  background-color: ${({ $active }) => ($active === 'true' ? 'var(--dark-blue)' : 'var(--blue)')};
  cursor: pointer;
  margin: 0 4px 4px 0;
  border-radius: ${({ $onlyChild }) => ($onlyChild === 'true' ? '10px 0 0 10px' : '0')};

  &:hover {
    background-color: var(--dark-blue);
  }

  &:first-child {
    border-radius: ${({ $onlyChild }) => ($onlyChild === 'true' ? '10px 0 0 10px' : '10px 0 0 0')};
  }

  &:last-child {
    border-radius: ${({ $onlyChild }) => ($onlyChild === 'true' ? '10px 0 0 10px' : '0 0 0 10px')};
  }

  img {
    flex: 1;
    margin-right: 20px;
    max-width: 50px;
    filter: grayscale(1) invert(1);
  }

  .text {
    flex-grow: 1;
    margin: 0 10px;
    font-weight: 700;
  }
`;

export const FaqContent = styled.div`
  padding: 20px;
  border-box: box-sizing;
  flex: 1;
  border: 1px solid var(--dark-blue);
  color: var(--dark-blue);
  min-height: 300px;
  border-radius: 0 10px 10px 10px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 200px;
    height: 200px;
    background-image: ${({ $bgImage }) => ($bgImage ? `url('/directus/assets/${$bgImage.id}/${$bgImage.filename_download}')` : 'none')};
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0.4;
  }
`;