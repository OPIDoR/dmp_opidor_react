import { createDirectus, graphql } from '@directus/sdk';

const client = createDirectus(`${window.location.origin}/directus`).with(graphql());

const getHelp = async () => {
  return client.query(`
    query {
      faq_categories(filter: { published: { _eq: true } }) {
        icon {
          id
          filename_download
        }
        translations {
          languages_code {
            code
          }
          title
        }
        questions(filter: { published: { _eq: true } }) {
          translations {
            languages_code {
              code
            }
            question
            answer
          }
        }
      }
    }
  `);
}

const getStaticPage = async (page) => {
  return client.query(`
    query {
      static_pages(filter: { status: { _eq: "published" }, path: { _eq: "${page}" } }) {
        path,
        translations {
          languages_code {
            code
          }
          title,
          content
        }
      }
    }
  `);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getHelp,
  getStaticPage,
};
