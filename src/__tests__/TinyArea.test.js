import { render, screen } from "@testing-library/react";
import React from "react";
import HandleGenerateForms from "../components/Builder/HandleGenerateForms";
import Global from "../components/context/Global";
import { mount } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";

configure({ adapter: new Adapter() });

let template = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "../Documentation/Implementation/data_model/Json/",
  title: "DataStorageStandard",
  description: "DataStorageStandard template",
  type: "object",
  class: "DataStorageStandard",
  properties: {
    description: {
      type: "string",
      description: "Description des besoins de stockage",
      inputType: "textarea",
      "label@fr_FR": "Besoins de stockage",
      "label@en_GB": "Storage needs",
      "form_label@fr_FR": "Décrire les besoins de stockage",
      "form_label@en_GB": "Describe storage needs",
    },
  },
  required: ["description"],
  to_string: [],
};

describe("HandleGenerateForms component", () => {
  it("should render input elements correctly", () => {
    const lng = "fr";
    const changeValue = jest.fn();
    render(
      <Global>
        <HandleGenerateForms template={template} lng={lng} changeValue={changeValue} />
      </Global>
    );
    expect(screen.getByText("Décrire les besoins de stockage")).toBeInTheDocument();
  });
});
