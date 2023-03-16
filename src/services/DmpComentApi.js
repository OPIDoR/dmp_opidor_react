import axios from "axios";

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
    const response = await axios.get("https://mocki.io/v1/1b10b249-506c-4a7f-a766-51d3d656c0b6");
    return response;
  } catch (error) {
    console.log(error);
  }
}
