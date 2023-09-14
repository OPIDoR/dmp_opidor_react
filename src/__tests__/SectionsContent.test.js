import React from "react";
import { render, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import WritePlan from "../components/WritePlan/WritePlan";
import { writePlan } from "../services";
import Global from "../components/context/Global";

jest.mock("../services/DmpWritePlanApi.js");

// This test file covers the following test cases:

// The Redaction component renders without crashing.
// The component displays questions when data is fetched from the API.
// The question panel toggles when clicked.

const mockSectionsData = {
  sections: [
    {
      id: 7456,
      title: "Description des données et collecte ou réutilisation de données existantes",
      description: null,
      number: 1,
      created_at: "2022-03-01T14:51:24.596Z",
      updated_at: "2022-03-01T14:51:24.596Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "f6144df2-8494-403e-a6d8-bf84b22283d6",
      questions: [
        {
          id: 30661,
          text: "<p>Description g&eacute;n&eacute;rale du produit de recherche</p>",
          default_value: "",
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 49,
          classname: "research_output_description",
        },
        {
          id: 30662,
          text: "Est-ce que des données existantes seront réutilisées ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 17,
          classname: "data_reuse",
        },
        {
          id: 30663,
          text: "Comment seront produites/collectées les nouvelles données ?",
          default_value: null,
          number: 3,
          question_format_id: 9,
          madmp_schema_id: 7,
          classname: "data_collection",
        },
        {
          id: 30674,
          text: "<p>Backup!</p>",
          default_value: "",
          number: 4,
          question_format_id: 9,
          madmp_schema_id: 1,
        },
      ],
    },
    {
      id: 7457,
      title: "Documentation et qualité des données",
      description: null,
      number: 2,
      created_at: "2022-03-01T14:51:24.909Z",
      updated_at: "2022-03-01T14:51:24.909Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "4bcf3904-76b7-464e-a214-37c140e345f4",
      questions: [
        {
          id: 30664,
          text: "Quelles métadonnées et quelle documentation (par exemple mode d'organisation des données) accompagneront les données ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 26,
        },
        {
          id: 30665,
          text: "Quelles seront les méthodes utilisées pour assurer la qualité scientifique des données ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 46,
        },
      ],
    },
    {
      id: 7458,
      title: "Exigences légales et éthiques, code de conduite",
      description: null,
      number: 3,
      created_at: "2022-03-01T14:51:25.171Z",
      updated_at: "2022-03-01T14:51:25.171Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "e05b9cda-b876-4801-aff2-4128e26222af",
      questions: [
        {
          id: 30666,
          text: "Quelles seront les mesures appliquées pour assurer la protection des données à caractère personnel ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 42,
          classname: "personal_data_issues",
        },
        {
          id: 30667,
          text: "Quelles sont les contraintes juridiques (sensibilité des données autres qu'à caractère personnel, confidentialité, ...) à prendre en compte pour le partage et le stockage des données ?",
          default_value: null,
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 35,
        },
        {
          id: 30668,
          text: "Quels sont les aspects éthiques à prendre en compte lors de la collecte des données ?",
          default_value: null,
          number: 3,
          question_format_id: 9,
          madmp_schema_id: 28,
        },
      ],
    },
    {
      id: 7459,
      title: "Traitement et analyse des données",
      description: null,
      number: 4,
      created_at: "2022-03-01T14:51:25.405Z",
      updated_at: "2022-03-01T14:51:25.405Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "e7690683-6825-472e-bd8b-64d23a8281ca",
      questions: [
        {
          id: 30669,
          text: "Comment et avec quels moyens seront traitées les données ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 14,
        },
      ],
    },
    {
      id: 7460,
      title: "Stockage et sauvegarde des données pendant le processus de recherche",
      description: null,
      number: 5,
      created_at: "2022-03-01T14:51:25.487Z",
      updated_at: "2022-03-01T14:51:25.487Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "ebf97cc1-af61-43b5-892d-8187f85792f6",
      questions: [
        {
          id: 30670,
          text: "Comment les données seront-elles stockées et sauvegardées tout au long du projet ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 22,
        },
      ],
    },
    {
      id: 7461,
      title: "Partage des données et conservation à long terme",
      description: null,
      number: 6,
      created_at: "2022-03-01T14:51:25.594Z",
      updated_at: "2022-03-01T14:51:25.594Z",
      phase_id: 1378,
      modifiable: true,
      versionable_id: "4ae63808-5794-43cc-9fe7-2a44d8f1c8ea",
      questions: [
        {
          id: 30671,
          text: "Comment les données seront-elles partagées ?",
          default_value: null,
          number: 1,
          question_format_id: 9,
          madmp_schema_id: 19,
        },
        {
          id: 30672,
          text: "<p>Comment les donn&eacute;es seront-elles conserv&eacute;es &agrave; long terme ?</p>",
          default_value: "",
          number: 2,
          question_format_id: 9,
          madmp_schema_id: 14,
        },
      ],
    },
  ],
  plan: {
    id: 8888,
    dmp_id: 9876,
    research_outputs: [
      {
        id: 9999,
        abbreviation: "Output 1",
        answers: {
          12347: {
            answer_id: 5687,
            fragment_id: 746321,
          },
        },
        metadata: {
          hasPersonalData: true,
          abbreviation: "indiquant le produit de recherche affiché",
        },
      },
      {
        id: 2345,
        abbreviation: "Output 2",
        metadata: {
          hasPersonalData: false,
          abbreviation: "MYRO",
        },
      },
      {
        id: 3456,
        abbreviation: "Output 3",
        metadata: {
          hasPersonalData: false,
          abbreviation: "MYRO",
        },
      },
      {
        id: 4567,
        abbreviation: "Output 4",
        metadata: {
          hasPersonalData: false,
          abbreviation: "MYRO",
        },
      },
      {
        id: 5678,
        abbreviation: "Output 5",
        metadata: {
          hasPersonalData: false,
          abbreviation: "MYRO",
        },
      },
    ],
    questions_with_guidance: [30661, 30662],
  },
};
describe("Redaction component", () => {
  beforeEach(() => {
    writePlan.getPlanData.mockResolvedValue(mockSectionsData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <Router>
          <Global>
            <WritePlan />
          </Global>
        </Router>
      );
    });
  });
});
