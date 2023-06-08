import React from 'react';

const NewsItem = ({ news }) => (
  <article className='news-item'>
    <a className='news-link' href={news.link} target='_blank' rel="noreferrer">
      <img className='news-img' alt="news thumbnail" src={news.thumbnail.source_url} />
      <h3 className='news-title' dangerouslySetInnerHTML={{ __html: news.title }}></h3>
    </a>
    <span className='news-date'>{news.date}</span>
  </article>
);


export default NewsItem;
