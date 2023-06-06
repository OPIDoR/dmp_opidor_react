import axios from "axios";

const dataFundingOrganization = [
  {
    id: 1,
    name: "Agence Nationale de la Recherche (ANR)",
  },
];

/**
 * The function "getComments" returns a mock data object for comments.
 * @param t - It is likely that "t" is a parameter representing the "test" object or module used for testing the function. It is common to use "t" as a
 * shorthand for "test" in testing frameworks such as Jest or Mocha.
 * @param token - The `token` parameter is likely an authentication token that is used to authenticate the user making the request to the server. It is
 * usually obtained after the user logs in and is used to verify the user's identity for subsequent requests.
 * @returns An object with a "data" property that contains the value of the "dataComent" variable.
 */
export async function getFunders(token) {
  try {
    //const response = await axios.get("note/");
    //return response;
    return { data: dataFundingOrganization };
  } catch (error) {
    console.log(error);
  }
}
/**
 * The function retrieves data on funded projects from a JSON file or API endpoint using an authentication token.
 * @param token - The `token` parameter is not used in the `getFundedProjects` function. It is not necessary for the function to work properly.
 * @returns an object with a `data` property that contains the response from the `ANRProjects.json` file.
 */
export async function getFundedProjects(token) {
  try {
    //const response = await axios.get("note/");
    //return response;
    const response = await require(`../data/ANRProjects.json`);
    return { data: response };
  } catch (error) {
    console.log(error);
  }
}

/**
 * The function `saveFunder` returns an empty array and catches any errors that occur during execution.
 * @param grantId - The ID of a grant project.
 * @param projectFragmentId - The `projectFragmentId` parameter is an identifier for a specific fragment of a project. It is used in conjunction with the
 * `grantId` parameter to retrieve data related to a specific project and fragment.
 * @returns An object with a "data" property that contains an empty array.
 */
export async function saveFunder(grantId, projectFragmentId) {
  try {
    // const response = await axios.get(`/codebase/anr_search?project_id=:${grantId}&fragment_id=:${projectFragmentId}&script_id=4`);
    // return response;
    return { data: [] };
  } catch (error) {
    console.error(error);
  }
}
