import axios from '../utils/AxiosClient';

const getPlanData = async (planId) => axios.get(`/plans/${planId}/answers_data`);

const getSectionsData = async (templateId) => axios.get(`/templates/${templateId}`);

export default {
  getPlanData,
  getSectionsData,
};
