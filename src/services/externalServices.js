import axios from '../utils/AxiosClient';

const getRor = async (query, filter) => axios.get("/api/v1/madmp/services/ror", { params: { query, filter } });

const getOrcid = async (search) => axios.get("/api/v1/madmp/services/orcid", { params: { search } });

const getMetadore = async (query) => axios.get("/api/v1/madmp/services/metadore", { params: { query } });

export default {
  getRor,
  getOrcid,
  getMetadore,
};
