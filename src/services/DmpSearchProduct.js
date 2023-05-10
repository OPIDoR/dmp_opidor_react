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
