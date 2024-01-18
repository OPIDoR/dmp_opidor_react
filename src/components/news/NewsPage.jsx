import React from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { fr, enGB } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import CustomSpinner from '../Shared/CustomSpinner.jsx';
import CustomError from '../Shared/CustomError.jsx';
import { news } from '../../services';

const locales = {
  'fr-FR': fr,
  'en-GB': enGB,
};

export default function NewsPage({ locale, size }) {
  const { i18n } = useTranslation();

  const { isLoading, error, data } = useQuery('news', () =>
    news.get(size).then(res => res.data)
  );

  if (isLoading) return <CustomSpinner />;

  if (error) return <CustomError error={error} />;

  return (
    <div id="homepage-news">
      {data.map((r) => ({
        id: r.id,
        title: r.title.rendered,
        link: r.link,
        date: format(new Date(r.date), 'dd/MM/yyyy', { locale: locales[i18n.resolvedLanguage || locale] }),
        thumbnail: r?.["_embedded"]?.["wp:featuredmedia"]?.[0]?.["media_details"]?.["sizes"]?.["medium_large"],
      })).map((n, id) => (
        <article key={`news-item-${id}`} className='news-item'>
          <a key={`news-link-${id}`} className='news-link' href={n.link} target='_blank' rel="noreferrer">
            <img key={`news-img-${id}`} className='news-img' alt="news thumbnail" src={n.thumbnail.source_url} />
            <h3 key={`news-title-${id}`} className='news-title' dangerouslySetInnerHTML={{ __html: n.title }}></h3>
          </a>
          <span key={`news-date-${id}`} className='news-date'>{n.date}</span>
        </article>
      ))}
    </div>
  )
}
