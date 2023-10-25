import React from "react";
import HandleGenerateForms from "../components/Builder/HandleGenerateForms";
import Global from "../components/context/Global";
import { mount } from "enzyme";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";
configure({ adapter: new Adapter() });

// Initialize i18n with a dummy translation
i18n.use(initReactI18next).init({
  lng: "fr",
  resources: {},
});

let template = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "../Documentation/Implementation/data_model/Json/",
  title: "BackupPolicyStandard",
  description: "BackupPolicyStandard template",
  type: "object",
  class: "BackupPolicyStandard",
  properties: {
    storageType: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Support de stockage des données",
      inputType: "dropdown",
      "label@fr_FR": "Supports de stockage",
      "label@en_GB": "Storage types",
      registry_name: "StorageType",
      overridable: true,
      "form_label@fr_FR": "Supports de stockage",
      "form_label@en_GB": "Storage types",
    },
  },
  required: ["description"],
  to_string: ["$.description"],
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
    expect(wrapper.find("SelectMultipleList").prop("label")).toBe("Supports de stockage");
    expect(wrapper.find("SelectMultipleList").prop("name")).toBe("storageType");
  });
});
