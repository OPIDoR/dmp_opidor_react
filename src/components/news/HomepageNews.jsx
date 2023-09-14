import React, { useEffect, useState } from "react";
import { get } from "lodash";

import NewsItem from "./NewsItem.jsx";
import { news as newsService } from "../../services";
import CustomSpinner from "../Shared/CustomSpinner.jsx";
import CustomError from "../Shared/CustomError.jsx";

function HomepageNews({ locale }) {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    newsService.get()
      .then(({ data }) => {
        const newsItems = data?.map((r) => ({
          id: r?.id,
          title: r?.title?.rendered,
          link: r?.link,
          date: new Date(r?.date).toLocaleDateString("fr-FR"),
          thumbnail: get(r, [
            "_embedded",
            "wp:featuredmedia",
            "0",
            "media_details",
            "sizes",
            "medium_large",
          ]),
        }));
        setNews(newsItems);
      })
      .catch((error) => {
        setError({
          code: error?.response?.status,
          message: error?.response?.statusText,
          error: error?.response?.data?.message || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError error={error} />}
      {!loading && !error && news.length > 0 && (
        <div id="homepage-news">
          {news.map((n) => (
            <NewsItem key={n.id} news={n} />
          ))}
        </div>
      )}
    </>
  );
}

export default HomepageNews;
