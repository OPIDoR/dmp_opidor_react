import axios from "axios";


function createHeaders(csrf = null) {
  if (csrf) {
    return {
      headers: {
        'X-CSRF-Token': csrf,
        'Content-Type': 'application/json',
      },
    };
  }

  return {
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

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
  let response;
  let url = "/api/v1/madmp/services/ror";

  let params = {};
  if (query) {
    params.query = query;
  }
  if (filter) {
    params.filter = filter;
  }
  try {
    response = await axios.get(url, { params, ...createHeaders() });
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

export async function getOrcid(search) {
  let response;
  let url = "/api/v1/madmp/services/orcid";

  let params = {};
  if (search) {
    params.search = search;
  }
  try {
    response = await axios.get(url, { params, ...createHeaders() });
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}
