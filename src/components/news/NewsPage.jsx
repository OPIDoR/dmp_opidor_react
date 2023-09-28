import React, { useEffect, useState } from 'react';

import NewsItem from './NewsItem.jsx';
import { news as newsService } from '../../services';
import CustomSpinner from '../Shared/CustomSpinner.jsx';

function NewsPage({locale}) {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    newsService(12)
      .then((data) => {
        const newsItems = data.map((r) => ({
          id: r.id,
          title: r.title.rendered,
          link: r.link,
          date: new Date(r.date).toLocaleDateString('fr-FR'),
          thumbnail: r?.["_embedded"]?.["wp:featuredmedia"]?.[0]?.["media_details"]?.["sizes"]?.["medium_large"],
        }));
        setNews(newsItems);
        setLoading(false);
      })
      .catch((error) => {
        setError({
          code: error?.response?.status,
          message: error?.response?.statusText,
          error: error?.response?.data?.message || '',
        });
        setLoading(false);
      });
  }, []); 

  return (
    <>
    {loading && (<CustomSpinner></CustomSpinner>)}
    {!loading && error && <p>error</p>}
    {!loading && !error && news.length > 0 && (
        <div id='news-page'>
          {news.map((n) => <NewsItem key={n.id} news={n}/>)}
        </div>
    )}
    </>
  );
}

export default NewsPage;
