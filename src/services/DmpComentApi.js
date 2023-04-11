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

/**
 * This function retrieves comments from an API using axios and returns the response.
 * @param t - It is likely that "t" is a parameter representing the test case or test suite being run. It may be used for logging or reporting purposes.
 * However, without more context it is difficult to determine its exact purpose.
 * @param token - There is no `token` parameter in the `getComments` function.
 * @returns a Promise that resolves to the response object from the API call made using axios.
 */
export async function getComments(t, token) {
  try {
    const response = await axios.get(`${api_url}27480811-d6e6-4da4-9b84-c8cbff2fca91`);
    //console.log(`${api_url}27480811-d6e6-4da4-9b84-c8cbff2fca91`);
    return response;
  } catch (error) {
    console.log(error);
  }
}

/**
 * This function posts a comment and returns a response object or an error object.
 * @param jsonObject - The parameter `jsonObject` is an object containing data to be sent in the request body when making a POST request. It is used as
 * the second argument in the `axios.post` method call. In this case, since the `axios.post` method call is commented out, the `jsonObject
 * @returns an object with a nested object "note" that has two properties: "id" and "text". The "id" property is set to 134 and the "text" property is
 * set to "<p>Mon commentaire</p>".
 */
export async function postComment(jsonObject) {
  try {
    //const response = await axios.post("/notes", jsonObject, "config");
    //console.log(response);
    return {
      note: {
        id: 134,
        text: "<p>Mon commentaire</p>",
      },
    };
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
 * This function updates a comment with a given ID and returns a new note object with a text property.
 * @param jsonObject - The JSON object containing the updated comment data.
 * @param id - The id parameter is the identifier of the comment that needs to be updated.
 * @returns an object with a nested object "note" that has a "text" property containing the string "<p>Mon commentaire</p>".
 */
export async function updateComment(jsonObject, id) {
  try {
    // const response = await axios.post("note/" + id, jsonObject, "config");
    // console.log(response);
    return {
      note: {
        text: "<p>Mon commentaire</p>",
      },
    };
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
 * This function deletes a comment by its ID using the axios library in JavaScript.
 * @param id - The `id` parameter is the identifier of the comment that needs to be deleted. It is used to construct the URL for the DELETE request to
 * the server.
 * @returns the response object from the axios.delete() method call.
 */
export async function deleteCommentById(id) {
  try {
    const response = await axios.delete("note/" + id, "config");
    return response;
  } catch (error) {
    console.error(error);
  }
}
