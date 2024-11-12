import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr, enGB } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Row, Col, Thumbnail, Button } from 'react-bootstrap';
import CustomSpinner from '../Shared/CustomSpinner.jsx';
import CustomError from '../Shared/CustomError.jsx';
import { news } from '../../services';

const locales = {
  'fr-FR': fr,
  'en-GB': enGB,
};

export default function NewsPage({ locale, size }) {
  const { t, i18n } = useTranslation();

  const { isLoading, error, data } = useQuery(['news'], () =>
    news.get(size).then(res => res.data)
  );

  if (isLoading) return <CustomSpinner />;

  if (error) return <CustomError error={error} />;

  return (
    <Row style={{
      display: 'flex',
      flexWrap: 'wrap',
    }}>
      {data.map((r) => ({
        id: r.id,
        title: r.title.rendered,
        content: r.content.rendered,
        link: r.link,
        date: format(new Date(r.date), 'dd/MM/yyyy', { locale: locales[i18n.resolvedLanguage || locale] }),
        full: r?.["_embedded"]?.["wp:featuredmedia"]?.[0]?.["media_details"]?.["sizes"]?.["full"],
      })).map((n, id) => (
        <Col
          xs={12}
          md={4}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          key={`col-${n.id}`}
        >
          <Thumbnail
            src={n.full.source_url}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
            key={`thumbnail-${n.id}`}
          >
            <h2 key={`title-${n.id}`}>
              <a key={`link-${n.id}`} href={n.link} dangerouslySetInnerHTML={{ __html: n.title }} />
            </h2>
            <p
              style={{
                marginBottom: '50px',
              }}
              dangerouslySetInnerHTML={{ __html: `${n.content.substring(0, 120)}...` }}
              key={`content-${n.id}`}
            />
            <p>
              <Button
                href={n.link}
                bsStyle="primary"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '30px',
                }}
                key={`read-button-${n.id}`}
              >{t('Read article')}</Button>
            </p>
          </Thumbnail>
        </Col>
      ))}
    </Row>
  )
}
