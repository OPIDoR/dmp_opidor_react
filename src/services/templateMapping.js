import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';


const MAPPING_URL = '/super_admin/template_mappings';
const MAPPING_OPTIONS = {headers: createHeaders({'Accept': 'application/json'}, true)};
console.log(MAPPING_OPTIONS);

const getMappings = async () => axios.get(MAPPING_URL, MAPPING_OPTIONS);
const getMapping = async (id) => axios.get(`${MAPPING_URL}/${id}`);
const newMapping = async (data) => axios.post(MAPPING_URL, { ...data, ...MAPPING_OPTIONS });

const updateMapping = async (id, data) => axios.put(`${MAPPING_URL}/${id}`, { ...data, ...MAPPING_OPTIONS });
const destroyMapping = async (id) => axios.delete(`${MAPPING_URL}/${id}`, MAPPING_OPTIONS);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getMappings,
  getMapping,
  newMapping,
  updateMapping,
  destroyMapping,
};
