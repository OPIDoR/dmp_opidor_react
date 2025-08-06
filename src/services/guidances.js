import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';

const getGuidances = async (planId, questionId)  => 
  axios.get(`/plans/${planId}/guidances?question=${questionId}`);

const getPlanGuidanceGroups = async (planId) => axios.get(`/plans/${planId}/guidance_groups`);

const postPlanGuidanceGroups = async (jsonObject, planId) => axios.post(`/plans/${planId}/guidance_groups`, jsonObject, { headers: createHeaders({}, true) });

const getResearchOutputGuidanceGroups = async (researchOutputId) => axios.get(`/research_outputs/${researchOutputId}/guidance_groups`);

const postResearchOutputGuidanceGroups = async (jsonObject, researchOutputId) => axios.post(`/research_outputs/${researchOutputId}/guidance_groups`, jsonObject, { headers: createHeaders({}, true) });

export default {
  getGuidances,
  getPlanGuidanceGroups,
  postPlanGuidanceGroups,
  getResearchOutputGuidanceGroups,
  postResearchOutputGuidanceGroups,
};
