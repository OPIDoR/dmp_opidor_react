import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';

const commonHeaders = createHeaders({}, true);

const dataFundingOrganization = [
  {
    id: 1,
    label: {
      fr: 'Agence Nationale de la Recherche (ANR)',
      en: 'French National Research Agency (ANR)',
    },
    scriptName: 'Anr_data_fetcher_v3',
    registry: 'AnrProjects',
  },
  {
    id: 2,
    label: {
      fr: 'Commission Européenne',
      en: 'European Commission',
    },
    scriptName: 'Cordis_data_fetcher',
    registry: 'CordisProjects',
  },
];

const getFunders = async () => ({ data: dataFundingOrganization });

const saveIsTestPlan = async (planId, isTestPlan) => axios.post(`/plans/${planId}/set_test`, { is_test: isTestPlan }, { headers: commonHeaders });

const importProject = async (grantId, projectFragmentId, scriptName) => axios.get(`/codebase/project_search?project_id=${grantId}&fragment_id=${projectFragmentId}&script_name=${scriptName}`);

export default {
  getFunders,
  saveIsTestPlan,
  importProject,
};
