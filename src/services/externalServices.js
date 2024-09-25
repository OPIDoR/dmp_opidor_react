import axios from '../utils/AxiosClient';

const getRor = async (query, filter) => axios.get("/api/v1/madmp/services/ror", { params: { query, filter } });

const getOrcid = async (search) => axios.get("/api/v1/madmp/services/orcid", { params: { search } });

const getMetadore = async (query) => {
  if (/^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i.test(query)) {
    query = `(attributes.doi: "${query}")`;
  } else {
    query = `(attributes.titles.title: "${query}")`;
  }
  return axios.get("/api/v1/madmp/services/metadore", { params: { query } });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getRor,
  getOrcid,
  getMetadore,
};
