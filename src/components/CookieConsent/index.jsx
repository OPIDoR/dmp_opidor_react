import { useEffect } from 'react';
import { MdOutlineCookie } from "react-icons/md";
import * as cookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

import config from './config';

const CookieConsent = () => {
  useEffect(() => {
    cookieConsent.run(config);
  }, []);

  const resetCookieConsent = (e) => {
    e.preventDefault()
    cookieConsent.reset(true);
    cookieConsent.run(config);
  };

  return (<MdOutlineCookie
    size={28}
    onClick={resetCookieConsent}
    style={{
      cursor: 'pointer',
    }}
  />);
};

export default CookieConsent;
