import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { Alert } from 'react-bootstrap';

import { CustomSpinner,
  CustomError,
  CustomSelect,
} from '../Shared';
import { directus } from '../../services';
import {
  StyledUl,
  StyledLi,
  GlossaryContent,
} from './styles.jsx';

const languagesCode = {
  'fr_FR': 'fr',
  'en_GB': 'en',
};

export default function HelpPage({ locale }) {
  const { t, i18n } = useTranslation();
  const [activeLetter, setActiveLetter] = useState('A');
  const letters = {
    A: {},
    B: {},
    C: {},
    D: {},
    E: {},
    F: {},
    G: {},
    H: {},
    I: {},
    J: {},
    K: {},
    L: {},
    M: {},
    N: {},
    O: {},
    P: {},
    Q: {},
    R: {},
    S: {},
    T: {},
    U: {},
    V: {},
    W: {},
    X: {},
    Y: {},
    Z: {},
  };

  const { isLoading, error, data } = useQuery('glossary', () =>
    directus.getGlossary().then(res => res)
  );

  if (isLoading) return <CustomSpinner />;

  if (error) return <CustomError error={error} />;

  const reduceTranslations = (translations, field) => translations
    .reduce(
      (o, translation) => ({ ...o, [languagesCode[translation?.languages_code?.code.replace('-', '_') || 'fr_FR']]: translation[field] }),
      {}
    );

  const terms = data?.glossary.map(({ translations }) => ({
    term: reduceTranslations(translations, 'term'),
    description: reduceTranslations(translations, 'description'),
  }));

  if (!terms || terms.length === 0) {
    return (<Alert bsStyle="warning">{t('Oh, it seems that this glossary page is still under development and does not yet contain any content.')}</Alert>)
  }

  const handleScroll = () => {
    const ulList = document.querySelectorAll('ul');
    ulList.forEach((ul) => {
      const rect = ul.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.22 && rect.bottom >= window.innerHeight * 0.22) {
        const currentLetter = ul.id.split('-')?.at(-1).toUpperCase();
        if (letters[currentLetter]) {
          setActiveLetter(currentLetter);
        }
      }
    });
  }

  window.addEventListener("scroll", handleScroll);

  terms.forEach(({ term, description }) => {
    const firstLetter = term[i18n.resolvedLanguage]?.charAt(0)?.toUpperCase();
    if (firstLetter) {
      const letterTerms = {
        ...letters[firstLetter],
        [term[i18n.resolvedLanguage]]: description[i18n.resolvedLanguage],
      };

      letters[firstLetter] = Object.keys(letterTerms)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .reduce((acc, key) => {
          acc[key] = letterTerms[key];
          return acc;
        }, {});
    }
  });

  const scrollToId = (letter) => {
    const element = document.querySelector(`#glossary-letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveLetter(letter);
  };

  const displayAlphabet = () => (
    <StyledUl>
      {Object.keys(letters).map((key, index) => (
        <StyledLi
          key={`glossary-${key}-${index}`}
          onClick={() => scrollToId(key)}
          className={activeLetter === key ? 'active' : null}
        >
          {key}
        </StyledLi>
      ))}
    </StyledUl>
  );

  const displayTerm = (termData, index) => (
    <li key={`glossary-term-${termData.at(0).toLowerCase()}`}>
      <div className="term" key={`glossary-term-${index}`}>{termData.at(0)}</div>
      <div
        className="description"
        key={`glossary-description-${index}`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(termData.at(1)),
        }}
      />
    </li>
  );

  return (
    <div>
      <h1>{t('Glossary')}</h1>
      {displayAlphabet()}
      <GlossaryContent>
        {Object.keys(letters).map((letter, index) => (
          <ul id={`glossary-letter-${letter}`} key={letter}>
            <span className="letter">{letter}</span>
            {
              Object.entries(letters[letter]).length > 0 ? (
                Object.entries(letters[letter])
                  .map((termData) => displayTerm(termData, index))
              ) : (
                <Alert bsStyle="info">{t('There don\'t seem to be any terms for this letter.')}</Alert>
              )
            }
          </ul>
        ))}
      </GlossaryContent>
    </div>
  )
}
