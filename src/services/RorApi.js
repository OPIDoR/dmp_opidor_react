import axios from "axios";

// export async function getRor(t, token) {
//   try {
//     //const response = await axios.get("/api/madmp/v1/services/ror");
//     const result = await require(`../data/ror.json`);
//     return { data: result };
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function getRor(query, filter) {
  try {
    let url = "/api/madmp/v1/services/ror";

    let params = {};
    if (query) {
      params.query = query;
    }
    if (filter) {
      params.filter = filter;
    }

    //const response = await axios.get(url, { params });
    const result = await require(`../data/ror.json`);
    return { data: result };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
