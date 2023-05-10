import axios from "axios";

const dataComent = [
  {
    id: 418,
    user_id: 1,
    text: "<p>Mon commentaire <strong>avec du formatage</strong></p>",
    archived: false,
    answer_id: 11549,
    archived_by: null,
    created_at: "2023-03-17T12:56:27.448Z",
    updated_at: "2023-03-17T12:56:27.448Z",
    user: {
      firstname: "DMP",
      surname: "Administrator",
      email: "info-opidor@inist.fr",
    },
  },
  {
    id: 419,
    user_id: 1,
    text: "<p>Mon commentaire</p>",
    archived: false,
    answer_id: 11549,
    archived_by: null,
    created_at: "2023-03-17T13:00:18.641Z",
    updated_at: "2023-03-17T13:00:18.641Z",
    user: {
      firstname: "DMP",
      surname: "Administrator",
      email: "info-opidor@inist.fr",
    },
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
export async function getComments(t, token) {
  try {
    //const response = await axios.get("note/");
    //return response;
    return { data: dataComent };
  } catch (error) {
    console.log(error);
  }
}

/**
 * This function posts a comment to a server using Axios and returns a note object with an ID and text.
 * @param jsonObject - The jsonObject parameter is an object that contains the data to be sent in the request body. It is passed as the second argument
 * to the axios.post() method.
 * @returns an object with a nested object "note" that has two properties: "id" and "text". The "id" property has a value of 134 and the "text" property
 * has a value of "<p>Mon commentaire</p>".
 */
export async function postComment(jsonObject) {
  try {
    //const response = await axios.post("/notes", jsonObject, "config");
    return {
      note: {
        id: 134,
        text: "<p>Mon commentaire</p>",
      },
    };
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * The function updates a comment with a given JSON object and ID.
 * @param jsonObject - The JSON object containing the updated comment data.
 * @param id - The id parameter is the identifier of the comment that needs to be updated. It is used to specify which comment to update in the backend.
 * @returns An object with a nested object "note" containing a "text" property with the value "<p>Mon commentaire</p>".
 */
export async function updateComment(jsonObject, id) {
  try {
    //const response = await axios.post("note/" + id, jsonObject, "config");
    return {
      note: {
        text: "<p>Mon commentaire</p>",
      },
    };
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * This function deletes a comment by its ID using the axios library in JavaScript.
 * @param id - The `id` parameter is the identifier of the comment that needs to be deleted. It is used to construct the URL for the DELETE request to
 * the server.
 * @returns a Promise that resolves to the response object returned by the axios.delete() method if the request is successful. If there is an error, the
 * function logs the error to the console but does not return anything.
 */
export async function deleteCommentById(id) {
  try {
    const response = await axios.delete("note/" + id, "config");
    return response;
  } catch (error) {
    console.error(error);
  }
}
