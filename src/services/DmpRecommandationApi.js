import axios from "axios";

const dataRecommendation = {
  all: {
    "Digital Curation Centre": [
      {
        id: 27,
        name: "DCC",
        org_id: 7,
      },
    ],
    "INRAE - Institut national de recherche pour l'agriculture l'alimentation et l'environnement": [
      {
        id: 28,
        name: "INRA",
        org_id: 5,
      },
      {
        id: 41,
        name: "INRA GenoBois",
        org_id: 5,
      },
    ],
    CIRAD: [
      {
        id: 29,
        name: "Guidance groupe CIRAD",
        org_id: 17,
      },
    ],
  },
  important: {
    "INRAE - Institut national de recherche pour l'agriculture l'alimentation et l'environnement": [
      {
        id: 28,
        name: "INRA",
        org_id: 5,
      },
      {
        id: 41,
        name: "INRA GenoBois",
        org_id: 5,
      },
    ],
  },
  selected: [28],
};

/**
 * This function retrieves recommendations for a given question ID and token.
 * @param questionId - The ID of the question for which the recommendation is being requested.
 * @param token - The `token` parameter is likely an authentication token or access token that is used to authenticate the user making the API request.
 * It is usually passed in the headers of the HTTP request to the API server.
 * @returns An object with a "data" property that contains the data for the recommendation. The actual data is not shown in the code snippet, but it is
 * likely stored in the "dataRecommendation" variable.
 */
export async function getRecommendation(planId) {
  try {
    //const response = await axios.get(`/plans/:${planId}/guidance_groups`);
    //return response;
    return { data: dataRecommendation };
  } catch (error) {
    console.error(error);
  }
}
