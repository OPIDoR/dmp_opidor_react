import axios from "axios";
import { api_url } from "../config";

// export async function getOrganizme(token) {
//   try {
//     const response = await axios.get("${api_url}fade6679-a726-4d00-b29d-2cb2fd67822e", {
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

export async function getRecommandation(token) {
  try {
    const response = await axios.get(`${api_url}6bf5491e-a16b-45e1-bc86-cc179b6dc7e6`);
    return response;
  } catch (error) {
    console.error(error);
  }
}
