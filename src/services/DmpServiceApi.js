import axios from "axios";

const dataContributor = [
  {
    nameType: "Personne",
    lastName: "FAURE",
    firstName: "Benjamin",
    mbox: "benji.f63@wanadoo.fr",
  },
  {
    nameType: "Personne",
    lastName: "LAIREZ",
    firstName: "Pierre",
    affiliationName: "Inria Saclay-Ile-de-France",
    affiliationId: "200818248E",
    affiliationIdType: "RNSR",
  },
  {
    nameType: "Personne",
    lastName: "CHENEVIER",
    firstName: "Pascale",
    affiliationName: "Systèmes Moléculaires et Matériaux pour l'Energie et la Santé",
    affiliationId: null,
    affiliationIdType: "RNSR",
  },
];
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

/**
 * This function loads a form template from a JSON file based on a given fragment ID, with a fallback to a default template if the requested one is not
 * found.
 * @param fragmentId - The `fragmentId` parameter is a string that represents the identifier of a form fragment. It is used to load the corresponding
 * form template from a JSON file.
 * @param token - The `token` parameter is not used in the `loadForm` function. It is included in the function signature but is not referenced anywhere
 * in the function body.
 * @returns a JSON object that is being loaded from a file located in the `../data/templates/` directory. The file being loaded is determined by the
 * `fragmentId` parameter passed to the function. If the file cannot be found, the function returns a default template file named `a-template.json`.
 */
export async function loadForm(fragmentId, token) {
  try {
    //const response = await axios.get(`/madmp_fragments/load_form/${fragmentId}`);
    return await require(`../data/templates/${fragmentId}-template.json`);
  } catch (error) {
    return await require(`../data/templates/a-template.json`);
  }
}
/**
 * This function loads a new form based on a given schema ID and object, and returns a JSON template.
 * @param schemaId - The ID of the schema/template being used for the form being loaded.
 * @param obj - The `obj` parameter is an object that contains a `plan` property, which in turn contains a `dmp_id` property.
 * @param researchId - The ID of the research output that the form is being loaded for.
 * @param questionId - The ID of the question being answered in the form.
 * @param planId - The ID of the DMP plan.
 * @param token - The `token` parameter is not used in the `loadNewForm` function. It is not necessary for the function to execute.
 * @returns a JSON object that is being imported from a file located in the `../data/templates/` directory. The file being imported is determined by the
 * `madmp_schema_id` parameter passed to the function. If an error occurs while trying to import the file, a default template file named
 * `a-template.json` is returned.
 */
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

/**
 * This function retrieves a value from a JSON file based on a given key and returns it.
 * @param t - The parameter `t` is a key used to access a specific value in the `registry_values.json` file.
 * @param token - The `token` parameter is not used in the function and is therefore unnecessary. It can be removed from the function definition.
 * @returns the value of the property with key `t` from the `registry_values.json` file located in the `../data/templates/` directory. However, the
 * function is not actually using the `response` variable obtained from the API call, and the `token` parameter is not being used either.
 */
export async function getRegistryValue(t, token) {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    const result = await require(`../data/templates/registry_values.json`);
    return result[t];
  } catch (error) {
    console.error(error);
  }
}

/**
 * The function retrieves a registry from a JSON file and returns it, using a token for authentication.
 * @param t - The parameter "t" is likely a string that represents a specific registry or dataset that the function is trying to retrieve. It is used to
 * dynamically import a JSON file that contains the data for that registry.
 * @param token - The `token` parameter is not used in the `getRegistry` function. It is not necessary for the function to work properly.
 * @returns the value of `result[t]` which is a property of the object stored in the `t` key of the JSON file located at `../data/registres/.json`.
 */
export async function getRegistry(t, token) {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    const result = await require(`../data/registres/${t}.json`);
    return result[t];
  } catch (error) {
    console.error(error);
  }
}

/**
 * The function returns a mocked data object for a contributor using a provided token.
 * @param token - The `token` parameter is not used in the provided code snippet. It is not clear what its purpose is without additional context.
 * @returns an object with a `data` property that contains the `dataContributor` variable. It is likely that `dataContributor` is an array or object
 * containing contributor data. However, without seeing the definition of `dataContributor`, it is impossible to know for sure.
 */
export async function getContributor(token) {
  try {
    // const response = await axios.get(`${api_url}96771ddd-1144-4dd5-8462-50e31461c235`);
    // return response;
    return { data: dataContributor };
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
