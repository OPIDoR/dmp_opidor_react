import React from "react";
import { act } from "react-dom/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import HandleGenerateForms from "../components/Builder/HandleGenerateForms";
import Global from "../components/context/Global";
import i18n from "../i18nTest";

let template = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "../Documentation/Implementation/data_model/Json/",
  title: "DataStorageStandard",
  description: "DataStorageStandard template",
  type: "object",
  class: "DataStorageStandard",
  properties: {
    cost: {
      type: "array",
      "table_header@fr_FR": "Type de coût : montant",
      "table_header@en_GB": "Cost type: amount",
      items: {
        type: "object",
        class: "Cost",
        properties: {
          dbid: {
            type: "number",
          },
        },
        template_name: "CostStandard",
        required: ["dbid"],
      },
      description: "Coûts éventuels liés au stockage des données",
      "label@fr_FR": "Coûts",
      "label@en_GB": "Costs",
      "form_label@fr_FR": "Coûts liés au stockage et à la sauvegarde des données",
      "form_label@en_GB": "Data storage and backup associated costs",
    },
  },
  required: ["description"],
  to_string: [],
};

describe("Handle Generate TextArea", () => {
  it("should render input elements correctly", async () => {
    const lng = "fr";
    const changeValue = jest.fn();
    //GlobalContext.Provider value={temp}
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <Global>
          <HandleGenerateForms template={template} lng={lng} changeValue={changeValue} />
        </Global>
      );
    });
    await waitFor(() => {
      expect(screen.getByText("Coûts liés au stockage et à la sauvegarde des données")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText("Add an element")).toBeInTheDocument();
    });
  });
});
