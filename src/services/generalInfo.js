import axios from '../utils/AxiosClient';
import createHeaders from "../utils/HeaderBuilder";

const commonHeaders = createHeaders({}, true);

const dataFundingOrganization = [
  {
    id: 1,
    label: {
      fr: 'Agence Nationale de la Recherche (ANR)',
      en: 'French National Research Agency (ANR)',
    },
    scriptName: 'AnrProjectDataFetcher',
    registry: 'AnrProjects',
  },
  {
    id: 2,
    label: {
      fr: 'Commission Européenne',
      en: 'European Commission',
    },
    scriptName: 'CordisDataFetcher',
    registry: 'CordisProjects',
  },
  {
    id: 3,
    label: {
      fr: 'Anses',
      en: 'Anses',
    },
    scriptName: 'AnsesProjectsDataFetcher',
    registry: 'AnsesProjects',
  },
];

const getFunders = async () => ({ data: dataFundingOrganization });

const saveIsTestPlan = async (planId, isTestPlan) =>
  axios.post(`/plans/${planId}/set_test`, { is_test: isTestPlan }, { headers: commonHeaders });

/**
 * The function `saveFunder` returns an empty array and catches any errors that occur during execution.
 * @param grantId - The ID of a grant project.
 * @param projectFragmentId - The `projectFragmentId` parameter is an identifier for a specific fragment of a project. It is used in conjunction with the
 * `grantId` parameter to retrieve data related to a specific project and fragment.
 * @param scriptName Script name
 * @returns An object with a "data" property that contains an empty array.
 */
const importProject = async (grantId, projectFragmentId, scriptName) =>
  axios.get(`/codebase/project_search?project_id=${grantId}&fragment_id=${projectFragmentId}&script_name=${scriptName}`);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getFunders,
  saveIsTestPlan,
  importProject,
};
