import axios from '../utils/AxiosClient';
import createHeaders from '../utils/HeaderBuilder';
import { toast } from "react-hot-toast";
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

const products = [
  {
    uuid: "65856096-32be-4dc0-ad47-841848709c93",
    title: "Default",
  },
  {
    uuid: "ed0cff2c-1f2e-4f0c-ac7b-09d16d472a2c",
    title: "Research Output 2",
  },
  {
    uuid: "dfb77c60-0040-4259-81d6-223f146a9f21",
    title: "Research Output 3",
  },
];

/**
 * This function sends a post request to a server with a JSON object and handles any errors that may occur.
 * @param jsonObject - This is an object containing the data to be sent in the POST request.
 * @returns An object with a "data" property, which is not defined in the code snippet. The value of "data" is likely intended to be the response data
 * from the axios post request, but it is not currently being assigned or returned correctly.
 */
const create = async (jsonObject) => axios.post(`/research_outputs`, jsonObject, { headers: createHeaders({}, true)});

const update = async (id, jsonObject) => axios.patch(`/research_outputs/${id}`, jsonObject, { headers: createHeaders({}, true)});

/**
 * This function adds a new object to a list in session storage.
 * @param planId - The ID of the plan to which the product is being imported.
 * @param uuid - The uuid parameter is a unique identifier for a product that is being imported.
 * @returns an object with a "data" property that contains the updated data stored in the session storage.
 */
const postImportProduct = async (planId, uuid) => {
  try {
    //   const objectProduct = {
    //     "plan_id": planId,
    //     "uuid": uuid
    // }
    //const response = await axios.post("/research_outputs/import", objectProduct, "config");
    const jsonObject = {
      id: new Date().getTime(),
      abbreviation: "Import test",
      metadata: {
        hasPersonalData: false,
        abbreviation: "test1",
      },
    };
    const saved = sessionStorage.getItem("data");
    const copieData = { ...JSON.parse(saved) };
    const newList = [...copieData.plan.research_outputs, jsonObject];
    copieData["plan"]["research_outputs"] = newList;
    sessionStorage.setItem("data", JSON.stringify(copieData));
    return { data: copieData };
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
}

/**
 * This function sends a DELETE request to a specific endpoint to delete a search product associated with a plan ID and research output ID.
 * @param planId - The ID of the plan that the research output belongs to.
 * @param id - The `id` parameter is the unique identifier of the research output that needs to be deleted.
 * @returns a Promise that resolves to the response object returned by the axios.delete() method.
 */
const deleteResearchOutput = async (researchOutputId, planId) => {
  let response;
  try {
    response = await axios.delete(`/research_outputs/${researchOutputId}?plan_id=${planId}`, { headers: createHeaders({}, true)});
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
  return response;
}

/**
 * This function retrieves plans using a token and returns them as data.
 * @returns An object with a "data" property that contains the "plans" data. However, the "plans" variable is not defined in the code snippet, so it is
 * unclear what data is being returned.
 */
const getPlans = async () => {
  try {
    //const response = await axios.get("/plans");
    //return response;
    return { data: plans };
  } catch (error) {
    console.error(error);
  }
}

/**
 * This function retrieves products data using an ID and token.
 * @param id - The `id` parameter is likely an identifier for a specific plan or research output. It is used in the commented out axios request to
 * retrieve data from an API endpoint.
 * @returns An object with a "data" property that contains the "products" data. However, the "products" variable is not defined in the code snippet, so
 * it is unclear what data is being returned.
 */
const getProducts = async (id) => {
  try {
    //const response = await axios.get(`/plans/${id}/research_outputs`);
    //return response;
    return { data: products };
  } catch (error) {
    console.error(error);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  create,
  update,
  postImportProduct,
  deleteResearchOutput,
  getPlans,
  getProducts,
};
