import styled from 'styled-components';
import { FaChevronUp } from 'react-icons/fa';

const BackToTopButton = styled.div`
  position: fixed;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--white);
  right: 3rem;
  bottom: 3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  background-color: var(--dark-blue);
  transform: scale(1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BackToTopButton onClick={scrollToTop}>
      <FaChevronUp size={28} />
    </BackToTopButton>
  );
};

export default BackToTop;
