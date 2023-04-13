import axios from "axios";
import { api_url } from "../config";
// export async function getRegistry(t, token) {
//   try {
//     const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1", {
//       withCredentials: true,
//       xsrfHeaderName: "X-XSRF-TOKEN",
//       headers: {
//         Bearer: `${token}`,
//       },
//     });
//     const result = require(`../data/registres/${t}.json`);
//     return result[t];
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function loadForm(t, token) {
//   try {
//     //const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
//     return await require(`../data/templates/${t}-template.json`);
//   } catch (error) {
//     return await require(`../data/templates/a-template.json`);
//   }
// }

export async function loadForm(fragmentId, token) {
  try {
    //const response = await axios.get(`/madmp_fragments/load_form/${fragmentId}`);
    return await require(`../data/templates/${fragmentId}-template.json`);
  } catch (error) {
    return await require(`../data/templates/a-template.json`);
  }
}

export async function loadNewForm(schemaId, obj, researchId, questionId, planId, token) {
  const plan_id = planId;
  const question_id = questionId;
  const research_output_id = researchId;
  const madmp_schema_id = schemaId;
  const dmp_id = obj.plan.dmp_id;
  try {
    // const response = await axios.get(
    //   `/madmp_fragments/load_new_form?madmp_fragment[answer][plan_id]=:${plan_id}&madmp_fragment[answer][question_id]=:${question_id}&madmp_fragment[answer][research_output_id]=:${research_output_id}&madmp_fragment[schema_id]=:${madmp_schema_id}&madmp_fragment[dmp_id]=:${dmp_id}`
    // );
    return await require(`../data/templates/${madmp_schema_id}-template.json`);
  } catch (error) {
    return await require(`../data/templates/a-template.json`);
  }
}

export async function getRegistryValue(t, token) {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    const result = await require(`../data/templates/registry_values.json`);
    return result[t];
  } catch (error) {
    console.error(error);
  }
}

export async function getRegistry(t, token) {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    const result = await require(`../data/registres/${t}.json`);
    return result[t];
  } catch (error) {
    console.error(error);
  }
}

export async function getContributor(token) {
  try {
    const response = await axios.get(`${api_url}96771ddd-1144-4dd5-8462-50e31461c235`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

/**
 * It sends a POST request to the server with the jsonObject as the body of the request.
 * </code>
 * @param jsonObject - the data you want to send to the server
 * @returns The response object from the server.
 */
export async function sendData(jsonObject) {
  try {
    const response = await axios.post("api_url", jsonObject, "config");
    console.log(response);
    //toast.success("Congé ajouter");
    return response;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      //toast.error("error server");
      console.log(error.response.data);
      console.log(error.response.message);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the
      // browser and an instance of
      // http.ClientRequest in node.js
      // toast.error("error request");
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
    return error;
  }
}
