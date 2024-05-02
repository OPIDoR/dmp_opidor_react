import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';

const getGuidances = async (planId, questionId)  => 
  axios.get(`/plans/${planId}/guidances?question=${questionId}`);

/**
 * This function retrieves recommendations for a given question ID and token.
 * @param questionId - The ID of the question for which the recommendation is being requested.
 * @param token - The `token` parameter is likely an authentication token or access token that is used to authenticate the user making the API request.
 * It is usually passed in the headers of the HTTP request to the API server.
 * @returns An object with a "data" property that contains the data for the recommendation. The actual data is not shown in the code snippet, but it is
 * likely stored in the "dataRecommendation" variable.
 */
const getGuidanceGroups = async (planId) => axios.get(`/plans/${planId}/guidance_groups`);

const postGuidanceGroups = async (jsonObject, planId) => axios.post(`/plans/${planId}/guidance_groups`, jsonObject, { headers: createHeaders({}, true) });

export default {
  getGuidances,
  getGuidanceGroups,
  postGuidanceGroups,
};
