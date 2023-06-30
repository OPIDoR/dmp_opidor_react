import React from "react";
import { shallow } from "enzyme";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import GeneralInfo, { ButtonSave } from "../components/GeneralInfo/GeneralInfo";
import i18n from "../i18nTest";
import { getFundedProjects, getFunders, saveFunder } from "../services/DmpGeneralInfoApi";
import CustomError from "../components/Shared/CustomError";
import CustomSpinner from "../components/Shared/CustomSpinner";
import Form from "../components/Forms/Form";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import Global from "../components/context/Global";

configure({ adapter: new Adapter() });

jest.mock("../services/DmpGeneralInfoApi", () => ({
  getFunders: jest.fn(),
  getFundedProjects: jest.fn(),
  saveFunder: jest.fn(),
}));

describe("GeneralInfo", () => {
  let wrapper;

  beforeEach(() => {
    getFundedProjects.mockResolvedValue({ data: { ANRProjects: [] } });
    getFunders.mockResolvedValue({ data: [] });
    saveFunder.mockResolvedValue({ data: {} });
    wrapper = shallow(<GeneralInfo />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });

  //   it("displays CustomSpinner when loading", async () => {
  //     jest.spyOn(global, "fetch").mockResolvedValue({
  //       json: jest.fn().mockResolvedValue([]),
  //     });

  //     render(
  //       <Router>
  //         <Global>
  //           <GeneralInfo />
  //         </Global>
  //       </Router>
  //     );

  //     const spinnerElement = screen.getByTestId("customSpinner");
  //     expect(spinnerElement).toBeInTheDocument();
  //     await waitForElementToBeRemoved(() => screen.queryByTestId("customSpinner"));
  //     // Clean up
  //     global.fetch.mockRestore();
  //   });

  //   it("displays CustomError when there is an error", async () => {
  //     const error = "Some error";
  //     getFundedProjects.mockImplementation(() => Promise.reject(error));
  //     const wrapper = shallow(<GeneralInfo />);
  //     // wait for useEffect calls to complete
  //     await Promise.resolve();
  //     wrapper.update();
  //     expect(wrapper.find(CustomError)).toHaveLength(1);
  //   });

  it("should handle save funder correctly", () => {
    const buttonSave = wrapper.find(ButtonSave);
    buttonSave.simulate("click");
    expect(saveFunder).toBeCalled();
  });
});
