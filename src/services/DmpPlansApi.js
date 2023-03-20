import axios from "axios";
import { api_url } from "../config";

// export async function getOrganizme(token) {
//   try {
//     const response = await axios.get("${api_url}fade6679-a726-4d00-b29d-2cb2fd67822e", {
//       withCredentials: true,
//       xsrfHeaderName: "X-XSRF-TOKEN",
//       headers: {
//         Bearer: `${token}`,
//       },
//     });
//     return response
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function getDefaultModel(token) {
  try {
    const response = await axios.get(`${api_url}eac1ebae-cd6a-414c-8be6-91502c5abe7c`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getOtherOrganisme(token, context) {
  try {
    //const response = await axios.get(`/template_options?plan[research_org_id]=none&plan[funder_id]=none&plan[context]=:${context}`);
    const response = await axios.get(`${api_url}fade6679-a726-4d00-b29d-2cb2fd67822e`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrganisme(token) {
  try {
    const response = await axios.get(`${api_url}54f2e340-fbf3-4e1a-9e70-85cc7ecb3a13`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getFunder(token) {
  try {
    const response = await axios.get(`${api_url}eee52301-69a0-4d81-9b1f-3a28b563f6df`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getOtherOrganismeById(token, obj, context) {
  const { id, name } = obj;
  try {
    // const response = await axios.get(
    //   `/template_options?plan[research_org_id][id]=:${id}&plan[research_org_id][name]=:${name}&plan[research_org_id][sort_name]=:${name}&plan[funder_id]=none&plan[context]=:${context}`
    // );
    const response = await axios.get(`${api_url}c2baaac5-4682-402d-a748-957f9e3a90e9`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getFunderById(token, obj, context) {
  const { id, name } = obj;
  try {
    // const response = await axios.get(
    //   `/template_options?plan[research_org_id]=none&plan[funder_id][id]=:${id}&plan[funder_id][name]=:${name}&plan[funder_id][sort_name]=:${name}&plan[context]=:${context}`
    // );
    const response = await axios.get(`${api_url}8ce04c4f-e04a-41e1-8b0f-7ae7c07d06df`);
    return response;
  } catch (error) {
    console.error(error);
  }
}
