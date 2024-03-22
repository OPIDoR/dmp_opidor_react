import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

import CustomSpinner from '../Shared/CustomSpinner.jsx';
import CustomError from '../Shared/CustomError.jsx';
import { directus } from '../../services';

const FaqContainer = styled.div`
  color: var(--dark-blue);
  width: 100%;
  display: flex;
  align-items: flex-start;
`;

const FaqCategories = styled.div`
  width: 350px;
  color: var(--dark-blue);
`;

const StyledUl = styled.ul`
  list-style-type: none;
`;

const StyledLi = styled.li`
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

const FaqContent = styled.div`
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

export default function HelpPage({ locale }) {
  const { t, i18n } = useTranslation(locale);
  const [activeFaq, setActiveFaq] = useState(0);

  const { isLoading, error, data } = useQuery('news', () =>
    directus.getHelp().then(res => res)
  );

  if (isLoading) return <CustomSpinner />;

  if (error) return <CustomError error={error} />;

  const languagesCode = {
    'fr-FR': 'fr',
    'en-GB': 'en',
  };

  const reduceTranslations = (translations, field) => translations
    .reduce(
      (o, translation) => ({ ...o, [languagesCode[translation?.languages_code?.code || 'fr-FR']]: translation[field] }),
      {}
    );

  let categories = data?.faq_categories.map(({ translations: categTranslations, ...category }) => ({
    ...category,
    title: reduceTranslations(categTranslations, 'title'),
    questions: category.questions.map(({ translations: questionTranslations, ...question }) => ({
      ...question,
      question: reduceTranslations(questionTranslations, 'question'),
      answer: reduceTranslations(questionTranslations, 'answer'),
    })),
  }));

  return (
    <FaqContainer>
      <FaqCategories>
        <StyledUl>
        {categories.map(({ title, icon }, index) => (
          <StyledLi
            $onlyChild={(categories.length === 1).toString()}
            $active={(activeFaq === index).toString()}
            key={`faq-category-${index}`}
            onClick={() => setActiveFaq(index)}
          >
            {icon && (<img src={`/directus/assets/${icon.id}/${icon.filename_download}`} alt="" key={icon.id} />)}
            <span className="text" key={`faq-category-title-${index}`}>{title[i18n.resolvedLanguage]}</span>
          </StyledLi>)
        )}
        </StyledUl>
      </FaqCategories>
      <FaqContent $bgImage={categories[activeFaq].icon}>
        {categories[activeFaq].questions.length === 0 ? (
          <div>{t('There seems to be no question for this category.')}</div>
        ) :
        categories[activeFaq].questions.map(({ question, answer }, index) => (
          <div key={`faq-content-${index}`} style={{ marginBottom: '40px' }}>
            <h2 key={`faq-question-${index}`} style={{ marginTop: 0 }}>{question[i18n.resolvedLanguage]}</h2>
            <div
              key={`faq-answer-${index}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(answer[i18n.resolvedLanguage]),
              }}
            />
          </div>
        ))}
      </FaqContent>
    </FaqContainer>
  )
}
