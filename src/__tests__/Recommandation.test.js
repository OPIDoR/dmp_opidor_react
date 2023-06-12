import React from "react";
import { mount } from "enzyme";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";
import { act } from "react-dom/test-utils";
import Recommandation from "../components/WritePlan/Recommandation";
import { render, waitFor } from "@testing-library/react";

// set up enzyme's react adapter
configure({ adapter: new Adapter() });

// provide translations for the test
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "Select the guidance of your plan": "Select the guidance of your plan",
        "Registration was successful !": "Registration was successful !",
        "Please select at least one recommendation": "Please select at least one recommendation",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
});

// Mocking the getRecommendation function

describe("Recommandation", () => {
  it("renders without crashing", async () => {
    const { getByText } = render(<Recommandation planId="1" setTriggerRender={() => {}} />);
    // eslint-disable-next-line testing-library/prefer-find-by
    const linkElement = await waitFor(() => getByText(/Select the guidance of your plan/i));
    expect(linkElement).toBeInTheDocument();
  });
});
