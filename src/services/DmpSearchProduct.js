import axios from "axios";
import { api_url } from "../config";
const data = {
  sections: [
    {
      id: 7456,
      title: "Description des données et collecte ou réutilisation de données existantes",
      description: null,
      number: 1,
      created_at: "2022-03-01T14:51:24.596Z",
      updated_at: "2022-03-01T14:51:24.596Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "f6144df2-8494-403e-a6d8-bf84b22283d6",
      questions: [
        {
          id: 30661,
          text: "<p>Description g&eacute;n&eacute;rale du produit de recherche</p>",
          default_value: "",
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 49,
        },
        {
          id: 30662,
          text: "Est-ce que des données existantes seront réutilisées ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 17,
        },
        {
          id: 30663,
          text: "Comment seront produites/collectées les nouvelles données ?",
          default_value: null,
          number: 3,
          question_format_id: 9,
          madmp_schema_id: 7,
        },
        {
          id: 30674,
          text: "<p>Backup!</p>",
          default_value: "",
          number: 4,
          question_format_id: 9,
          madmp_schema_id: 1,
        },
      ],
    },
    {
      id: 7457,
      title: "Documentation et qualité des données",
      description: null,
      number: 2,
      created_at: "2022-03-01T14:51:24.909Z",
      updated_at: "2022-03-01T14:51:24.909Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "4bcf3904-76b7-464e-a214-37c140e345f4",
      questions: [
        {
          id: 30664,
          text: "Quelles métadonnées et quelle documentation (par exemple mode d'organisation des données) accompagneront les données ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 26,
        },
        {
          id: 30665,
          text: "Quelles seront les méthodes utilisées pour assurer la qualité scientifique des données ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 46,
        },
      ],
    },
    {
      id: 7458,
      title: "Exigences légales et éthiques, code de conduite",
      description: null,
      number: 3,
      created_at: "2022-03-01T14:51:25.171Z",
      updated_at: "2022-03-01T14:51:25.171Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "e05b9cda-b876-4801-aff2-4128e26222af",
      questions: [
        {
          id: 30666,
          text: "Quelles seront les mesures appliquées pour assurer la protection des données à caractère personnel ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 42,
        },
        {
          id: 30667,
          text: "Quelles sont les contraintes juridiques (sensibilité des données autres qu'à caractère personnel, confidentialité, ...) à prendre en compte pour le partage et le stockage des données ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 35,
        },
        {
          id: 30668,
          text: "Quels sont les aspects éthiques à prendre en compte lors de la collecte des données ?",
          default_value: null,
          number: 3,
          question_format_id: 9,
          madmp_schema_id: 28,
        },
      ],
    },
    {
      id: 7459,
      title: "Traitement et analyse des données",
      description: null,
      number: 4,
      created_at: "2022-03-01T14:51:25.405Z",
      updated_at: "2022-03-01T14:51:25.405Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "e7690683-6825-472e-bd8b-64d23a8281ca",
      questions: [
        {
          id: 30669,
          text: "Comment et avec quels moyens seront traitées les données ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 14,
        },
      ],
    },
    {
      id: 7460,
      title: "Stockage et sauvegarde des données pendant le processus de recherche",
      description: null,
      number: 5,
      created_at: "2022-03-01T14:51:25.487Z",
      updated_at: "2022-03-01T14:51:25.487Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "ebf97cc1-af61-43b5-892d-8187f85792f6",
      questions: [
        {
          id: 30670,
          text: "Comment les données seront-elles stockées et sauvegardées tout au long du projet ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 22,
        },
      ],
    },
    {
      id: 7461,
      title: "Partage des données et conservation à long terme",
      description: null,
      number: 6,
      created_at: "2022-03-01T14:51:25.594Z",
      updated_at: "2022-03-01T14:51:25.594Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "4ae63808-5794-43cc-9fe7-2a44d8f1c8ea",
      questions: [
        {
          id: 30671,
          text: "Comment les données seront-elles partagées ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 19,
        },
        {
          id: 30672,
          text: "<p>Comment les donn&eacute;es seront-elles conserv&eacute;es &agrave; long terme ?</p>",
          default_value: "",
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 14,
        },
      ],
    },
  ],
  plan: {
    id: 1234,
    dmp_id: 9876,
    research_outputs: [
      {
        id: 1234,
        abbreviation: "Output 1",
        answers: {
          12347: {
            answer_id: 5687,
            fragment_id: 746321,
          },
        },
      },
      {
        id: 2345,
        abbreviation: "Output 2",
      },
      {
        id: 3456,
        abbreviation: "Output 3",
      },
      {
        id: 4567,
        abbreviation: "Output 4",
      },
      {
        id: 5678,
        abbreviation: "Output 5",
      },
      {
        id: 6789,
        abbreviation: "Output 6",
      },
      {
        id: 7891,
        abbreviation: "Output 7",
      },
      {
        id: 2,
        abbreviation: "Output 8",
      },
      {
        id: 3,
        abbreviation: "Output 9",
      },
      {
        id: 4,
        abbreviation: "Output 10",
      },
      {
        id: 5,
        abbreviation: "Output 11",
      },
      {
        id: 6,
        abbreviation: "Output 12",
      },
      {
        id: 7,
        abbreviation: "Output 13",
      },
      {
        id: 8,
        abbreviation: "Output 14",
      },
      {
        id: 9,
        abbreviation: "Output 15",
      },
      {
        id: 10,
        abbreviation: "Output 16",
      },
    ],
  },
};
const dataAfterDelete = {
  sections: [
    {
      id: 7456,
      title: "Description des données et collecte ou réutilisation de données existantes",
      description: null,
      number: 1,
      created_at: "2022-03-01T14:51:24.596Z",
      updated_at: "2022-03-01T14:51:24.596Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "f6144df2-8494-403e-a6d8-bf84b22283d6",
      questions: [
        {
          id: 30661,
          text: "<p>Description g&eacute;n&eacute;rale du produit de recherche</p>",
          default_value: "",
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 49,
        },
        {
          id: 30662,
          text: "Est-ce que des données existantes seront réutilisées ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 17,
        },
        {
          id: 30663,
          text: "Comment seront produites/collectées les nouvelles données ?",
          default_value: null,
          number: 3,
          question_format_id: 9,
          madmp_schema_id: 7,
        },
        {
          id: 30674,
          text: "<p>Backup!</p>",
          default_value: "",
          number: 4,
          question_format_id: 9,
          madmp_schema_id: 1,
        },
      ],
    },
    {
      id: 7457,
      title: "Documentation et qualité des données",
      description: null,
      number: 2,
      created_at: "2022-03-01T14:51:24.909Z",
      updated_at: "2022-03-01T14:51:24.909Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "4bcf3904-76b7-464e-a214-37c140e345f4",
      questions: [
        {
          id: 30664,
          text: "Quelles métadonnées et quelle documentation (par exemple mode d'organisation des données) accompagneront les données ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 26,
        },
        {
          id: 30665,
          text: "Quelles seront les méthodes utilisées pour assurer la qualité scientifique des données ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 46,
        },
      ],
    },
    {
      id: 7458,
      title: "Exigences légales et éthiques, code de conduite",
      description: null,
      number: 3,
      created_at: "2022-03-01T14:51:25.171Z",
      updated_at: "2022-03-01T14:51:25.171Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "e05b9cda-b876-4801-aff2-4128e26222af",
      questions: [
        {
          id: 30666,
          text: "Quelles seront les mesures appliquées pour assurer la protection des données à caractère personnel ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 42,
        },
        {
          id: 30667,
          text: "Quelles sont les contraintes juridiques (sensibilité des données autres qu'à caractère personnel, confidentialité, ...) à prendre en compte pour le partage et le stockage des données ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 35,
        },
        {
          id: 30668,
          text: "Quels sont les aspects éthiques à prendre en compte lors de la collecte des données ?",
          default_value: null,
          number: 3,
          question_format_id: 9,
          madmp_schema_id: 28,
        },
      ],
    },
    {
      id: 7459,
      title: "Traitement et analyse des données",
      description: null,
      number: 4,
      created_at: "2022-03-01T14:51:25.405Z",
      updated_at: "2022-03-01T14:51:25.405Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "e7690683-6825-472e-bd8b-64d23a8281ca",
      questions: [
        {
          id: 30669,
          text: "Comment et avec quels moyens seront traitées les données ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 14,
        },
      ],
    },
    {
      id: 7460,
      title: "Stockage et sauvegarde des données pendant le processus de recherche",
      description: null,
      number: 5,
      created_at: "2022-03-01T14:51:25.487Z",
      updated_at: "2022-03-01T14:51:25.487Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "ebf97cc1-af61-43b5-892d-8187f85792f6",
      questions: [
        {
          id: 30670,
          text: "Comment les données seront-elles stockées et sauvegardées tout au long du projet ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 22,
        },
      ],
    },
    {
      id: 7461,
      title: "Partage des données et conservation à long terme",
      description: null,
      number: 6,
      created_at: "2022-03-01T14:51:25.594Z",
      updated_at: "2022-03-01T14:51:25.594Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "4ae63808-5794-43cc-9fe7-2a44d8f1c8ea",
      questions: [
        {
          id: 30671,
          text: "Comment les données seront-elles partagées ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 19,
        },
        {
          id: 30672,
          text: "<p>Comment les donn&eacute;es seront-elles conserv&eacute;es &agrave; long terme ?</p>",
          default_value: "",
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 14,
        },
      ],
    },
  ],
  plan: {
    id: 1234,
    dmp_id: 9876,
    research_outputs: [
      {
        id: 2345,
        abbreviation: "Output 2",
      },
      {
        id: 3456,
        abbreviation: "Output 3",
      },
      {
        id: 4567,
        abbreviation: "Output 4",
      },
      {
        id: 5678,
        abbreviation: "Output 5",
      },
      {
        id: 6789,
        abbreviation: "Output 6",
      },
      {
        id: 7891,
        abbreviation: "Output 7",
      },
      {
        id: 2,
        abbreviation: "Output 8",
      },
      {
        id: 3,
        abbreviation: "Output 9",
      },
      {
        id: 4,
        abbreviation: "Output 10",
      },
      {
        id: 5,
        abbreviation: "Output 11",
      },
      {
        id: 6,
        abbreviation: "Output 12",
      },
      {
        id: 7,
        abbreviation: "Output 13",
      },
      {
        id: 8,
        abbreviation: "Output 14",
      },
      {
        id: 9,
        abbreviation: "Output 15",
      },
      {
        id: 10,
        abbreviation: "Output 16",
      },
    ],
  },
};
// export async function getOrganizme(token) {
//   try {
//     const response = await axios.get("https://mocki.io/v1/fade6679-a726-4d00-b29d-2cb2fd67822e", {
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

export async function getTypeSearchProduct(token) {
  try {
    const response = await axios.get(`${api_url}9a58cd0e-13fd-4eae-91f2-b238e722dd18`);
    return response;
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
    const copieData = { ...data };
    const newList = [...copieData.plan.research_outputs, jsonObject];
    copieData["plan"]["research_outputs"] = newList;
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

    const copieData = { ...data };
    const newList = copieData.plan.research_outputs;
    const updatedArray = newList.filter((object) => object.id !== researchOutputId);
    copieData["plan"]["research_outputs"] = updatedArray;
    return { data: copieData };
  } catch (error) {
    console.error(error);
  }
}
