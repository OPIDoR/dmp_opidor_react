import axios from '../utils/AxiosClient';
import { toast } from "react-hot-toast";

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

const dataDefaultModel = {
  id: 276,
  title: "Science Europe : modèle structuré",
};
const dataOtherOrganisme = [
  {
    id: 23,
    name: "AMUE - Agence de Mutualisation des Universités et Etablissements",
    sort_name: "AMUE - Agence de Mutualisation des Universités et Etablissements",
  },
  {
    id: 24,
    name: "ASSISTANCE PUBLIQUE - Hôpitaux de Marseille",
    sort_name: "ASSISTANCE PUBLIQUE - Hôpitaux de Marseille",
  },
  {
    id: 20,
    name: "AgroParisTech - Institut des sciences et industries du vivant et de l'environnement",
    sort_name: "AgroParisTech - Institut des sciences et industries du vivant et de l'environnement",
  },
  {
    id: 28,
    name: "CAMPUS CONDORCET",
    sort_name: "CAMPUS CONDORCET",
  },
  {
    id: 274,
    name: "CC-IN2P3 (Centre de Calcul - Institut national de physique nucléaire et de physique des particules du CNRS)",
    sort_name: "CC-IN2P3",
  },
  {
    id: 29,
    name: "CEA Commissariat à l'énergie atomique et aux énergies alternatives",
    sort_name: "CEA Commissariat à l'énergie atomique et aux énergies alternatives",
  },
  {
    id: 33,
    name: "CINES",
    sort_name: "CINES",
  },
  {
    id: 10,
    name: "CIRAD",
    sort_name: "CIRAD",
  },
  {
    id: 4,
    name: "CNRS",
    sort_name: "CNRS",
  },
];
const dataOrganisme = {
  templates: [
    {
      id: 614,
      title: "ANR - Modèle de PGD (français) (Personnalisé par CNRS)",
      default: false,
    },
    {
      id: 555,
      title: "ERC DMP (Personnalisé par CNRS)",
      default: false,
    },
    {
      id: 600,
      title: "Final - MASA - Modèle de PGD (français)",
      default: false,
    },
    {
      id: 399,
      title: "Horizon 2020 DMP (Personnalisé par CNRS)",
      default: false,
    },
    {
      id: 401,
      title: "Horizon 2020 FAIR DMP (anglais) (Personnalisé par CNRS)",
      default: false,
    },
  ],
};
const dataFunder = [
  {
    id: 271,
    name: "Agence nationale de la recherche (ANR)",
    sort_name: "Agence nationale de la recherche",
  },
  {
    id: 6,
    name: "Commission européenne",
    sort_name: "Commission européenne",
  },
  {
    id: 236,
    name: "Conseil européen de la recherche (European Research Council, ERC)",
    sort_name: "Conseil européen de la recherche",
  },
  {
    id: 280,
    name: "INCa - Institut national du cancer",
    sort_name: "INCa - Institut national du cancer",
  },
];
const dataOtherOrganismeById = {
  templates: [
    {
      id: 760,
      title:
        "Horizon 2020 FAIR DMP (français) (Personnalisé par INRAE - Institut national de recherche pour l'agriculture l'alimentation et l'environnement)",
      default: false,
    },
    {
      id: 501,
      title: "INRA - Trame Structure (5 modes de gestion)",
      default: false,
    },
    {
      id: 518,
      title: "INRA - Trame générique v2",
      default: false,
    },
    {
      id: 828,
      title: "INRAE Trame projet v3",
      default: false,
    },
    {
      id: 829,
      title: "Test",
      default: false,
    },
  ],
};
const dataFunderById = {
  templates: [
    {
      id: 294,
      title: "Horizon 2020 DMP",
      default: false,
    },
    {
      id: 289,
      title: "Horizon 2020 FAIR DMP (anglais)",
      default: false,
    },
    {
      id: 295,
      title: "Horizon 2020 FAIR DMP (français)",
      default: false,
    },
    {
      id: 820,
      title: "Horizon Europe DMP (anglais)",
      default: false,
    },
  ],
};

/**
 * This function returns a default template data object or an error if it fails to retrieve the data.
 * @param token - The `token` parameter is not used in the `getDefaultModel` function. It is not necessary for the function to work properly.
 * @returns an object with a `data` property that contains the `dataDefaultModel` value.
 */
export async function getDefaultTemplate() {
  let response;
  try {
    response = await axios.get('/template_options/default', createHeaders());
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

/**
 * This is an asynchronous function that retrieves data for an other organism by ID and name using a token and context.
 * @param orgData - An object containing the id and name of the research organization.
 * @param researchContext - The context parameter is a string that specifies the context in which the function is being called. It is used to determine the
 * appropriate data to return.
 * @returns An object with a "data" property, which contains the data for the "dataOtherOrganismeById" variable.
 */

export async function getTemplatesByOrgId(orgData, researchContext) {
  const { id, name } = orgData;
  let response;
  try {
    response = await axios.get(
      `/template_options?plan[research_org_id][id]=${id}&plan[research_org_id][name]=${name}&plan[research_org_id][sort_name]=${name}&plan[funder_id]=none&plan[context]=${researchContext}`
    , createHeaders());
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

/**
 * This function retrieves data for a funder by their ID and name.
 * @param obj - An object containing the id and name of the funder being requested.
 * @param context - The context parameter is a string that specifies the context in which the funder is being requested. It could be a project, a grant
 * application, or any other relevant context.
 * @returns An object with a "data" property that contains the dataFunderById variable.
 */
export async function getTemplatesByFunderId(funderData, researchContext) {
  const { id, name } = funderData;
  let response;
  try {
    response = await axios.get(
      `/template_options?plan[research_org_id]=none&plan[funder_id][id]=${id}&plan[funder_id][name]=${name}&plan[funder_id][sort_name]=${name}&plan[context]=${researchContext}`
    , createHeaders());
  } catch (error) {
    console.error(error);
    return error;
  }
  return response;
}

/**
 * This function returns a mock data object for an organism.
 * @param token - The `token` parameter is not used in the `getOrganisme` function. It is not necessary for the function to work properly.
 * @returns an object with a "data" property that contains the dataOrganisme variable.
 */
export async function getOrgs(researchContext) {
  let response;
  try {
    response = await axios.get(`/orgs/list?context=${researchContext}&type=org`, createHeaders());
  } catch (error) {
    console.error(error);
  }
  return response;
}

/**
 * The function "getFunder" returns data from a hardcoded source or an API endpoint using a provided token.
 * @param token - The `token` parameter is not used in the `getFunder` function. It is not necessary for the function to work properly.
 * @returns an object with a "data" property that contains the value of the "dataFunder" variable.
 */
export async function getFunders(researchContext) {
  let response;
  try {
    response = await axios.get(`/orgs/list?context=${researchContext}&type=funder`, createHeaders());
  } catch (error) {
    console.error(error);
  }
  return response;
}
/**
 * Send choosen templateId to the back for the plan creation,
 * Redirect to the newly created plan if necessary
 * @param templateId identifier of the choosen template
 * @returns 
 */
export async function createPlan(templateId) {
  let response;
  const csrf = document.querySelector('meta[name="csrf-token"]').content;
  try {
    response = await axios.post(`/plans`, { template_id: templateId }, createHeaders(csrf));
  } catch (error) {
    if (error.response) {
      toast.error(error.response.message);
    } else if (error.request) {
      toast.error(error.request);
    } else {
      toast.error(error.message);
    }
  }
  return response;

}
