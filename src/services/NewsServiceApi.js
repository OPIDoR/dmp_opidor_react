import axios from 'axios';

export async function getNews(perPage = 3) {
  let response;
  try {
    response = await axios.get(`https://opidor.fr/wp-json/wp/v2/posts?per_page=${perPage}&categories=5&_embed`);
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

export default getNews;
