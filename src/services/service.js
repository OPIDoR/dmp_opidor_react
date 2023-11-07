import axios from 'axios';
import createHeaders from '../utils/HeaderBuilder';


const getFragment = async (id) => axios.get(`/madmp_fragments/${id}`);

const createFragment = async (data = {}, madmpSchemaId, planId, questionId = null, researchOutputId = null) => axios.post(
  '/madmp_fragments/create_json', {
    data,
    schema_id: madmpSchemaId,
    plan_id: planId,
    question_id: questionId,
    research_output_id: researchOutputId
  },
  { headers: createHeaders({}, true) },
);

const destroyFragment = async (fragmentId) => axios.delete(
  `/madmp_fragments/${fragmentId}`,
  { headers: createHeaders({}, true) },
)

const getSchema = async (id) => axios.get(`/madmp_schemas/${id}`);

export async function getRegistryById(id) {
  let response;
  try {
    response = await axios.get(`/registries/${id}`);
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

const getRegistryByName = async (name, page = null) => axios.get(`/registries/by_name/${name}`, { params: { page }});

const getPersons = async (dmpId) => axios.get(`/madmp_fragments/load_fragments?dmp_id=${dmpId}&classname=person`);

const getContributors = async (planId) => axios.get(`/plans/${planId}/contributors_data`);

const destroyContributor = async (fragmentId) => axios.delete(
  `/madmp_fragments/destroy_contributor?contributor_id=${fragmentId}`,
  { headers: createHeaders({}, true) },
)

/**
 * It sends a POST request to the server with the jsonObject as the body of the request.
 * </code>
 * @param jsonObject - the data you want to send to the server
 * @returns The response object from the server.
 */
const saveForm = async (id, jsonObject) => axios.post(`/madmp_fragments/update_json/${id}`, jsonObject, {
  headers: createHeaders({}, true),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getFragment,
  createFragment,
  destroyFragment,
  getSchema,
  getRegistryByName,
  getPersons,
  saveForm,
  getContributors,
  destroyContributor,
};
