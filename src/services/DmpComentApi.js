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

export async function getComments(t, token) {
  try {
    const response = await axios.get(`${api_url}27480811-d6e6-4da4-9b84-c8cbff2fca91`);
    console.log(`${api_url}27480811-d6e6-4da4-9b84-c8cbff2fca91`);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function postNote(jsonObject) {
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

export async function updateNote(jsonObject, id) {
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

export async function deleteNoteById(id) {
  try {
    const response = await axios.delete("note/" + id, "config");
    return response;
  } catch (error) {
    console.error(error);
  }
}
