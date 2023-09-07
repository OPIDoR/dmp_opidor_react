import axios from '../utils/AxiosClient';
import createHeaders from "../utils/HeaderBuilder";

/**
 * The function "getComments" returns a mock data object for comments.
 * @param t - It is likely that "t" is a parameter representing the "test" object or module used for testing the function. It is common to use "t" as a
 * shorthand for "test" in testing frameworks such as Jest or Mocha.
 * @param token - The `token` parameter is likely an authentication token that is used to authenticate the user making the request to the server. It is
 * usually obtained after the user logs in and is used to verify the user's identity for subsequent requests.
 * @returns An object with a "data" property that contains the value of the "dataComent" variable.
 */
export async function getComments(answerId) {
  let response;
  try {
    response = await axios.get(`/answers/${answerId}/notes`, {
      headers: createHeaders(),
    });
  } catch (error) {
    return error;
  }
  return response;
}

/**
 * This function posts a comment to a server using Axios and returns a note object with an ID and text.
 * @param jsonObject - The jsonObject parameter is an object that contains the data to be sent in the request body. It is passed as the second argument
 * to the axios.post() method.
 * @returns an object with a nested object "note" that has two properties: "id" and "text". The "id" property has a value of 134 and the "text" property
 * has a value of "<p>Mon commentaire</p>".
 */
export async function postComment(comment) {
  return axios.post("/notes", comment, {
    headers: createHeaders({}, true),
  });
}

/**
 * The function updates a comment with a given JSON object and ID.
 * @param jsonObject - The JSON object containing the updated comment data.
 * @param id - The id parameter is the identifier of the comment that needs to be updated. It is used to specify which comment to update in the backend.
 * @returns An object with a nested object "note" containing a "text" property with the value "<p>Mon commentaire</p>".
 */
export async function updateComment(comment) {
  return axios.put(`/notes/${comment?.id}`, comment, {
    headers: createHeaders({}, true),
  });
}

/**
 * This function deletes a comment by its ID using the axios library in JavaScript.
 * @param id - The `id` parameter is the identifier of the comment that needs to be deleted. It is used to construct the URL for the DELETE request to
 * the server.
 * @returns a Promise that resolves to the response object returned by the axios.delete() method if the request is successful. If there is an error, the
 * function logs the error to the console but does not return anything.
 */
export async function archiveComment(id, comment) {
  return  axios.patch(`/notes/${id}/archive`, comment, {
    headers: createHeaders({}, true),
  });
}
