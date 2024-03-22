import { createDirectus, graphql } from '@directus/sdk';

const client = createDirectus(`${window.location.origin}/directus`).with(graphql());

const getHelp = async () => client.query(`
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getHelp,
};
