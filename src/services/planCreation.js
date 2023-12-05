import axios from '../utils/AxiosClient';
import createHeaders from "../utils/HeaderBuilder";

/**
 * This function returns a default template data object or an error if it fails to retrieve the data.
 * @param token - The `token` parameter is not used in the `getDefaultModel` function. It is not necessary for the function to work properly.
 * @returns an object with a `data` property that contains the `dataDefaultModel` value.
 */
const getDefaultTemplate = async () => axios.get('/template_options/default');

/**
 * This is an asynchronous function that retrieves data for an other organism by ID and name using a token and context.
 * @param orgData - An object containing the id and name of the research organization.
 * @param researchContext - The context parameter is a string that specifies the context in which the function is being called. It is used to determine the
 * appropriate data to return.
 * @returns An object with a "data" property, which contains the data for the "dataOtherOrganismeById" variable.
 */

const getTemplatesByOrgId = async (orgData, researchContext) => {
  const { id, name } = orgData;

  return axios.get('/template_options', {
    params: {
      'plan[research_org_id][id]': id,
      'plan[research_org_id][name]': name,
      'plan[research_org_id][sort_name]': name,
      'plan[funder_id]': 'none',
      'plan[context]': researchContext,
    },
  });
}

/**
 * This function retrieves data for a funder by their ID and name.
 * @param obj - An object containing the id and name of the funder being requested.
 * @param context - The context parameter is a string that specifies the context in which the funder is being requested. It could be a project, a grant
 * application, or any other relevant context.
 * @returns An object with a "data" property that contains the dataFunderById variable.
 */
export async function getTemplatesByFunderId(funderData, researchContext) {
  const { id, name } = funderData;

  return axios.get('/template_options', {
    params: {
      'plan[research_org_id]': 'none',
      'plan[funder_id][id]': id,
      'plan[funder_id][name]': name,
      'plan[funder_id][sort_name]': name,
      'plan[context]': researchContext,
    }
  });
}

/**
 * This function returns a mock data object for an organism.
 * @param token - The `token` parameter is not used in the `getOrganisme` function. It is not necessary for the function to work properly.
 * @returns an object with a "data" property that contains the dataOrganisme variable.
 */
const getOrgs = async (researchContext) => axios.get(`/orgs/list?context=${researchContext}&type=org`);

/**
 * The function "getFunder" returns data from a hardcoded source or an API endpoint using a provided token.
 * @param token - The `token` parameter is not used in the `getFunder` function. It is not necessary for the function to work properly.
 * @returns an object with a "data" property that contains the value of the "dataFunder" variable.
 */
const getFunders = async (researchContext) => axios.get(`/orgs/list?context=${researchContext}&type=funder`);

/**
 * Send choosen templateId to the back for the plan creation,
 * Redirect to the newly created plan if necessary
 * @param templateId identifier of the choosen template
 * @returns 
 */
const createPlan = async (template_id) => axios.post(`/plans`, { template_id }, { headers: createHeaders({}, true) });

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getDefaultTemplate,
  getTemplatesByOrgId,
  getTemplatesByFunderId,
  getOrgs,
  getFunders,
  createPlan,
};
