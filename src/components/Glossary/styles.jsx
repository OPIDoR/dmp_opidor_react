import styled from 'styled-components';

export const StyledUl = styled.ul`
  display: flex;
  padding: 0;
  align-items: center;
  list-style-type: none;
  white-space: nowrap;
  margin-bottom: 20px;

  position: -webkit-sticky;
  position: sticky;
  top: 70px;
  z-index: 1000;
`;

export const StyledLi = styled.li`
  flex-grow: 1;
  width: 0;
  color: var(--blue);
  cursor: pointer;
  margin: 0 5px 0 5px;

  &:hover {
    color: var(--dark-blue);
    text-decoration: underline;
  }

  &:not(:last-child)::after {
    content: '●';
    margin-left: 20px;
    display: inline-block;
    vertical-align: middle;
    color: var(--blue);
  }

  &.active {
    color: var(--dark-blue);
    text-decoration: underline;
  }
`;

export const GlossaryContent = styled.div`
  margin: 20px 0 0 -35px;

  .letter {
    font-weigth: 900;
    font-size: 28px;
    color: var(--rust);
  }

  ul {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    list-style-type: none;
    margin-top: 20px;

    li {
      margin: 10px 0 10px 20px;

      .term {
        font-weigth: 900;
        font-size: 22px;
      }

      .description {
        color: var(--blue);
      }
    }
  }
`;