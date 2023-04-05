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
    const response = await axios.get(`${api_url}6109ffca-457d-40b6-8759-b17816645271`);
    return response;
  } catch (error) {
    console.error(error);
  }
}
