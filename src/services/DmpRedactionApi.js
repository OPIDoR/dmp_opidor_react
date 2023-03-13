import axios from "axios";

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
    const response = await axios.get("https://mocki.io/v1/f2e418a4-5e69-42ad-a06a-1b8bd2730783");
    return response;
  } catch (error) {
    console.error(error);
  }
}
