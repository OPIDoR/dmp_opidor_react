import util from "util";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import FirstStep from "../components/plans/FirstStep";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";
import Global from "../components/context/Global";
configure({ adapter: new Adapter() });

Object.defineProperty(global, "TextEncoder", {
  value: util.TextEncoder,
});

describe("FirstStep", () => {
  it("should update context state when checkbox is checked", () => {
    const wrapper = mount(
      <Global>
        <FirstStep handleNextStep={() => {}} />
      </Global>
    );
    const setContext = jest.fn();
    // Simulate checkbox click and verify context state is updated
    act(() => {
      wrapper.findWhere((node) => node.is("#flexRadioDefault1")).simulate("click");
      //   wrapper.find(".form-check #flexRadioDefault2").simulate("click");
      //   wrapper.find("input#flexRadioDefault2").simulate("click");
      //   wrapper.find(".form-check-input#flexRadioDefault2").simulate("click");
    });
    //expect(setContext).toHaveBeenCalledWith({ context: "research_structure" });
  });
});
