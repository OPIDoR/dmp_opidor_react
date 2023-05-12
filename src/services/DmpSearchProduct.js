import axios from "axios";

const dataTypeSearchProduct = [
  {
    en_GB: "Dataset",
    fr_FR: "Jeu de données",
  },
  {
    en_GB: "Software",
    fr_FR: "Logiciel",
  },
  {
    en_GB: "Model",
    fr_FR: "Modèle",
  },
  {
    en_GB: "Physical object",
    fr_FR: "Objet physique",
  },
  {
    en_GB: "Workflow",
    fr_FR: "Workflow",
  },
  {
    en_GB: "Audiovisual",
    fr_FR: "Audiovisuel",
  },
  {
    en_GB: "Collection",
    fr_FR: "Collection",
  },
  {
    en_GB: "Image",
    fr_FR: "Image",
  },
  {
    en_GB: "Interactive resource",
    fr_FR: "Resource interactive",
  },
  {
    en_GB: "Service",
    fr_FR: "Service",
  },
  {
    en_GB: "Sound",
    fr_FR: "Son",
  },
  {
    en_GB: "Text",
    fr_FR: "Texte",
  },
];

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
 * This is an asynchronous function that returns a data object of a specific type of product search when given a token.
 * @param token - The `token` parameter is not used in the `getTypeSearchProduct` function. It is not necessary for the function to execute and can be
 * removed.
 * @returns An object with a "data" property that contains the value of the "dataTypeSearchProduct" variable.
 */
export async function getTypeSearchProduct(token) {
  try {
    //const response = await axios.get(`${api_url}9a58cd0e-13fd-4eae-91f2-b238e722dd18`);
    //return response;
    return { data: dataTypeSearchProduct };
  } catch (error) {
    console.error(error);
  }
}

/**
 * This function sends a post request to a server with a JSON object and handles any errors that may occur.
 * @param jsonObject - This is an object containing the data to be sent in the POST request.
 * @returns An object with a "data" property, which is not defined in the code snippet. The value of "data" is likely intended to be the response data
 * from the axios post request, but it is not currently being assigned or returned correctly.
 */
export async function postSearchProduct(jsonObject) {
  try {
    //const response = await axios.post("/research_outputs", jsonObject, "config");
    const saved = sessionStorage.getItem("data");
    const copieData = { ...JSON.parse(saved) };
    const newList = [...copieData.plan.research_outputs, jsonObject];
    copieData["plan"]["research_outputs"] = newList;
    sessionStorage.setItem("data", JSON.stringify(copieData));
    return { data: copieData };
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

/**
 * This function adds a new object to a list in session storage.
 * @param planId - The ID of the plan to which the product is being imported.
 * @param uuid - The uuid parameter is a unique identifier for a product that is being imported.
 * @returns an object with a "data" property that contains the updated data stored in the session storage.
 */
export async function postImportProduct(planId, uuid) {
  try {
    //   const objectProduct = {
    //     "plan_id": planId,
    //     "uuid": uuid
    // }
    //const response = await axios.post("/research_outputs/import", objectProduct, "config");
    const jsonObject = {
      id: new Date().getTime(),
      abbreviation: "test2",
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

/**
 * This function sends a DELETE request to a specific endpoint to delete a search product associated with a plan ID and research output ID.
 * @param planId - The ID of the plan that the research output belongs to.
 * @param id - The `id` parameter is the unique identifier of the research output that needs to be deleted.
 * @returns a Promise that resolves to the response object returned by the axios.delete() method.
 */
export async function deleteSearchProduct(researchOutputId, planId) {
  try {
    //const response = await axios.delete(`/plans/${planId}/research_outputs/${id}`, "config");
    const saved = sessionStorage.getItem("data");
    const copieData = { ...JSON.parse(saved) };
    const newList = copieData.plan.research_outputs;
    const updatedArray = newList.filter((object) => object.id !== researchOutputId);
    copieData["plan"]["research_outputs"] = updatedArray;
    sessionStorage.setItem("data", JSON.stringify(copieData));
    return { data: copieData };
  } catch (error) {
    console.error(error);
  }
}

/**
 * This function retrieves plans using a token and returns them as data.
 * @param token - The `token` parameter is not used in the provided code snippet. It is likely intended to be used for authentication or authorization
 * purposes when making the API request to retrieve the plans data.
 * @returns An object with a "data" property that contains the "plans" data. However, the "plans" variable is not defined in the code snippet, so it is
 * unclear what data is being returned.
 */
export async function getPlans(token) {
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
 * @param token - The `token` parameter is likely an authentication token that is used to authenticate the user making the request to the server. It is
 * usually passed in the headers of the HTTP request to the server.
 * @returns An object with a "data" property that contains the "products" data. However, the "products" variable is not defined in the code snippet, so
 * it is unclear what data is being returned.
 */
export async function getProducts(id, token) {
  try {
    //const response = await axios.get(`/plans/${id}/research_outputs`);
    //return response;
    return { data: products };
  } catch (error) {
    console.error(error);
  }
}
