import React, { useEffect, useState } from 'react';
import { get } from 'lodash';

import NewsItem from './NewsItem.jsx';
import { getNews } from '../../services/NewsServiceApi.js';
import CustomSpinner from '../Shared/CustomSpinner.jsx';
import styles from '../assets/css/overlay.module.css';

function NewsPage({locale}) {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNews(12)
      .then(
        (result) => {
          const newsItems = result.data.map((r) => ({
            id: r.id,
            title: r.title.rendered,
            link: r.link,
            date: new Date(r.date).toLocaleDateString('fr-FR'),
            thumbnail: get(r, ['_embedded', 'wp:featuredmedia', '0', 'media_details', 'sizes', 'medium_large']),
          }));
          setNews(newsItems);
          setLoading(false);
        },
        (error) => {
          setError(error);
          setLoading(false);
        },
      );
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
