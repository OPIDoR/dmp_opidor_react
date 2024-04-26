import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { Alert } from 'react-bootstrap';

import { CustomError, CustomSpinner } from '../Shared';
import { directus } from '../../services';

import {
  FaqContainer,
  FaqCategories,
  StyledUl,
  StyledLi,
  FaqContent,
} from './styles.jsx';

const languagesCode = {
  'fr_FR': 'fr',
  'en_GB': 'en',
};

export default function HelpPage({ locale }) {
  const { t } = useTranslation();
  const [activeFaq, setActiveFaq] = useState(0);

  const { isLoading, error, data } = useQuery('news', () =>
    directus.getHelp().then(res => res)
  );

  if (isLoading) return <CustomSpinner />;

  if (error) return <CustomError error={error} />;

  const reduceTranslations = (translations, field) => translations
    .reduce(
      (o, translation) => ({ ...o, [languagesCode[translation?.languages_code?.code.replace('-', '_') || 'fr_FR']]: translation[field] }),
      {}
    );

  const categories = data?.faq_categories.map(({ translations: categTranslations, ...category }) => ({
    ...category,
    title: reduceTranslations(categTranslations, 'title'),
    questions: category.questions.map(({ translations: questionTranslations, ...question }) => ({
      ...question,
      question: reduceTranslations(questionTranslations, 'question'),
      answer: reduceTranslations(questionTranslations, 'answer'),
    })),
  }));

  if (categories.length === 0) {
    return (<Alert bsStyle="warning">{t('Oh, it seems that this help page is still under development and does not yet contain any content.')}</Alert>)
  }

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
            <span className="text" key={`faq-category-title-${index}`}>{title[languagesCode[locale]]}</span>
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
            <h2 key={`faq-question-${index}`} style={{ marginTop: 0 }}>{question[languagesCode[locale]]}</h2>
            <div
              key={`faq-answer-${index}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(answer[languagesCode[locale]]),
              }}
            />
          </div>
        ))}
      </FaqContent>
    </FaqContainer>
  )
}
