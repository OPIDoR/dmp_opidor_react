import { toast } from 'react-hot-toast';
import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';
import { getErrorMessage } from '../utils/utils';

const plans = [
  {
    id: 18024,
    title: 'DMP du projet "Silicium, soufre et carbone issu de biomasse pour des batteries durables"',
  },
  {
    id: 18290,
    title: 'DMP du projet "Histoire et archéologie des monastères et des sites ecclésiaux d’Istrie et de Dalmatie (IVe-XIIe s.)"',
  },
  {
    id: 14894,
    title: 'DMP du projet "Complexes de lanthanides luminescents avec réponse optique dynamique ajustable"',
  },
];

const create = async (jsonObject) => axios.post('/research_outputs', jsonObject, { headers: createHeaders({}, true) });

const update = async (id, jsonObject) => axios.patch(`/research_outputs/${id}`, jsonObject, { headers: createHeaders({}, true) });

const postImportProduct = async (planId, uuid) => {
  try {
    //   const objectProduct = {
    //     "plan_id": planId,
    //     "uuid": uuid
    // }
    // const response = await axios.post("/research_outputs/import", objectProduct, "config");
    const jsonObject = {
      id: new Date().getTime(),
      abbreviation: 'Import test',
      metadata: {
        hasPersonalData: false,
        abbreviation: 'test1',
      },
    };
    const saved = sessionStorage.getItem('data');
    const copieData = { ...JSON.parse(saved) };
    const newList = [...copieData.plan.research_outputs, jsonObject];
    copieData.plan.research_outputs = newList;
    sessionStorage.setItem('data', JSON.stringify(copieData));
    return { data: copieData };
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};

const deleteResearchOutput = async (researchOutputId, planId) => {
  let response;
  try {
    response = await axios.delete(`/research_outputs/${researchOutputId}?plan_id=${planId}`, { headers: createHeaders({}, true) });
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  return response;
};

const getPlans = async () => ({ data: plans }); // axios.get("/plans")

const getProducts = async (id) => axios.get(`/plans/${id}/research_outputs`);

export default {
  create,
  update,
  postImportProduct,
  deleteResearchOutput,
  getPlans,
  getProducts,
};
