import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';

const getRecommendedTemplate = async (researchContext, locale) => axios.get(`/template_options/recommend?context=${researchContext}&locale=${locale}`);

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
};

export async function getTemplatesByFunderId(funderData, researchContext) {
  const { id, name } = funderData;

  return axios.get('/template_options', {
    params: {
      'plan[research_org_id]': 'none',
      'plan[funder_id][id]': id,
      'plan[funder_id][name]': name,
      'plan[funder_id][sort_name]': name,
      'plan[context]': researchContext,
    },
  });
}

const getOrgs = async (researchContext) => axios.get(`/orgs/list?context=${researchContext}&type=org`);

const getFunders = async (researchContext) => axios.get(`/orgs/list?context=${researchContext}&type=funder`);

const createPlan = async (templateId) => axios.post('/plans', { templateId }, { headers: createHeaders({}, true) });

export default {
  getRecommendedTemplate,
  getTemplatesByOrgId,
  getTemplatesByFunderId,
  getOrgs,
  getFunders,
  createPlan,
};
