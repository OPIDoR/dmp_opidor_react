import axios from 'axios';
import toast from 'react-hot-toast';
import { createHeaders } from '../utils/HeaderBuilder';


const getFragment = async (id) => axios.get(`/madmp_fragments/${id}`);

const loadNewForm = async (planId, questionId, researchOutputId, madmpSchemaId, dmpId, locale) => axios.post(
  '/madmp_fragments/create_json', {
    madmp_fragment: {
      answer: {
        plan_id: planId,
        question_id: questionId,
        research_output_id: researchOutputId,
      },
      schema_id: madmpSchemaId,
      dmp_id: dmpId,
      template_locale: locale
    }
  },
  { headers: createHeaders({}, true) },
);

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

const getRegistryByName = async (name) => axios.get(`/registries/by_name/${name}`);

const getContributors = async (dmpId) => axios.get(`/madmp_fragments/load_fragments?dmp_id=${dmpId}&classname=person`);

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
  loadNewForm,
  getSchema,
  getRegistryByName,
  getContributors,
  saveForm,
};
