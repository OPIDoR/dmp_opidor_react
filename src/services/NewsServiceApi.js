import axios from '../utils/AxiosClient';

export async function getNews(perPage = 3) {
  return axios.get(`https://opidor.fr/wp-json/wp/v2/posts?per_page=${perPage}&categories=5&_embed`);
}

export default getNews;
