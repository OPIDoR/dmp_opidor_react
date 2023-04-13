import axios from "axios";
import { api_url } from "../config";

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

export async function getQuestion(token) {
  try {
    const response = await axios.get(`${api_url}33e4891c-de58-4834-9221-f8a118e60670`);
    return response;
  } catch (error) {
    console.error(error);
  }
}
