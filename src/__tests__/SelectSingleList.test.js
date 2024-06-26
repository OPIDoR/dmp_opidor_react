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
  title: "DataStorageStandard",
  description: "DataStorageStandard template",
  type: "object",
  class: "DataStorageStandard",
  properties: {
    volumeUnit: {
      type: "string",
      description: "Unité de volume",
      inputType: "dropdown",
      "label@fr_FR": "Unité",
      "label@en_GB": "Unit",
      registry_name: "VolumeUnit",
      overridable: true,
      "form_label@fr_FR": "Unité",
      "form_label@en_GB": "Unit",
    },
  },
  required: ["description"],
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
    expect(wrapper.find("SelectSingleList").prop("label")).toBe("Unité");
    expect(wrapper.find("SelectSingleList").prop("name")).toBe("volumeUnit");
  });
});
