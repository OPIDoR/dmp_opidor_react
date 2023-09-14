import axios from '../utils/AxiosClient';

const getRor = async (query, filter) => axios.get("/api/v1/madmp/services/ror", { params: { query, filter } });

const getOrcid = async (search) => axios.get("/api/v1/madmp/services/orcid", { params: { search } });

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getRor,
  getOrcid,
};
