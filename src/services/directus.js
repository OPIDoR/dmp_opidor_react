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

const getGlossary = async () => {
  return client.query(`
    query {
      glossary(filter: { status: { _eq: "published" } }) {
        translations {
          languages_code {
            code
          }
          term
          description
        }
      }
    }
  `);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getHelp,
  getGlossary,
};
