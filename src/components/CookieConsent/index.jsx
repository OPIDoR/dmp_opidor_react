import { useEffect } from 'react';
import styled from 'styled-components';
import { MdOutlineCookie } from 'react-icons/md';
import * as cookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

import config from './config';

const CookieButton = styled.div`
  position: fixed;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--white);
  left: 3rem;
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

const CookieConsent = () => {
  useEffect(() => {
    cookieConsent.run(config);
  }, []);

  const resetCookieConsent = (e) => {
    e.preventDefault()
    cookieConsent.reset(true);
    cookieConsent.run(config);
  };

  return (
    <CookieButton onClick={resetCookieConsent}>
      <MdOutlineCookie size={28} />
    </CookieButton>
  );
};

export default CookieConsent;
