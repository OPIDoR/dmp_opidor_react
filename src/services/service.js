import axios from 'axios';
import createHeaders from '../utils/HeaderBuilder';


const getFragment = async (id) => axios.get(`/madmp_fragments/${id}`);

const createFragment = async (data = {}, madmpSchemaId, planId, questionId = null, researchOutputId = null, propertyName = null) => axios.post(
  '/madmp_fragments', {
    data,
    schema_id: madmpSchemaId,
    plan_id: planId,
    question_id: questionId,
    research_output_id: researchOutputId,
  },
  { headers: createHeaders({}, true) },
);

const destroyFragment = async (fragmentId) => axios.delete(
  `/madmp_fragments/${fragmentId}`,
  { headers: createHeaders({}, true) },
)

const getSchema = async (id) => axios.get(`/madmp_schemas/${id}`);

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
 * @param id - The fragment id
 * @param jsonObject - the data you want to send to the server
 * @returns The response object from the server.
 */
const saveFragment = async (id, jsonObject) => axios.put(`/madmp_fragments/${id}`, jsonObject, {
  headers: createHeaders({}, true),
});

const getSchemasByClass = async (className) => axios.get(`/madmp_schemas?by_classname=${className}`)

const changeForm = async (fragmentId, templateId, locale) => axios.get(`/madmp_fragments/change_form/${fragmentId}?schema_id=${templateId}&locale=${locale}`);

const runScript = async(fragmentId, scriptName) => axios.get(`/codebase/run?fragment_id=${fragmentId}&script_name=${scriptName}`)
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getFragment,
  createFragment,
  destroyFragment,
  getSchema,
  getRegistryByName,
  getPersons,
  saveFragment,
  getContributors,
  destroyContributor,
  getSchemasByClass,
  changeForm,
  runScript,
};
