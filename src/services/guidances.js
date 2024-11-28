import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';

const getGuidances = async (planId, questionId)  => 
  axios.get(`/plans/${planId}/guidances?question=${questionId}`);

const getGuidanceGroups = async (planId) => axios.get(`/plans/${planId}/guidance_groups`);

const postGuidanceGroups = async (jsonObject, planId) => axios.post(`/plans/${planId}/guidance_groups`, jsonObject, { headers: createHeaders({}, true) });

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getGuidances,
  getGuidanceGroups,
  postGuidanceGroups,
};
