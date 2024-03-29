import React from "react";
import HandleGenerateForms from "../components/Builder/HandleGenerateForms";
import Global from "../components/context/Global";
import { mount } from "enzyme";

import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";
import i18n from "../i18nTest";
configure({ adapter: new Adapter() });

let template = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "../Documentation/Implementation/data_model/Json/",
  title: "ResearchOutputDescriptionStandard",
  description: "ResearchOutputDescriptionStandard template",
  type: "object",
  class: "ResearchOutputDescriptionStandard",
  properties: {
    uncontrolledKeywords: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Mots clés libres",
      "label@fr_FR": "Mots clés (texte libre)",
      "label@en_GB": "Keywords (free-text)",
      "tooltip@fr_FR": "Un mot clé par ligne. Cliquer sur + pour ajouter un mot-clé. Eviter les acronymes et les mots clés trop génériques",
      "tooltip@en_GB": "One key word per line. Click on + to add a key word. Avoid acronyms and overly generic keywords",
      "form_label@fr_FR": "Mots clés (texte libre)",
      "form_label@en_GB": "Uncontrolled keyword(s) (free-text)",
    },
  },
  required: ["title", "description", "type", "controlledKeyword", "language", "containsPersonalData", "containsSensitiveData", "hasEthicalIssues"],
  to_string: [],
};

describe("HandleGenerateForms component", () => {
  it("should render input elements correctly", () => {
    const lng = "fr";
    const changeValue = jest.fn();
    const wrapper = mount(
      <Global>
        <HandleGenerateForms template={template} lng={lng} changeValue={changeValue} />
      </Global>
    );
    expect(wrapper.find("InputTextArray").prop("label")).toBe("Mots clés (texte libre)");
    expect(wrapper.find("InputTextArray").prop("name")).toBe("uncontrolledKeywords");
  });
});
