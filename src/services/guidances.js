import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';

const getGuidances = async (planId, questionId)  => 
  axios.get(`/plans/${planId}/guidances?question=${questionId}`);

const getGuidanceGroups = async (planId, locale = 'fr-FR') => {
  const locales = {
    en: 'en-GB',
    fr: 'fr-FR',
  };

  return axios.get(`/plans/${planId}/guidance_groups?locale=${(locales?.[locale] || locale).replace('_', '-')}`);
};

const postGuidanceGroups = async (jsonObject, planId, locale = 'fr-FR') => axios.post(`/plans/${planId}/guidance_groups?locale=${locale.replace('_', '-')}`, jsonObject, { headers: createHeaders({}, true) });

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getGuidances,
  getGuidanceGroups,
  postGuidanceGroups,
};
