import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import RedactionLayout from "../components/redaction/RedactionLayout";
import { getQuestion } from "../services/DmpRedactionApi";
import { GlobalContext } from "../components/context/Global";
import Global from "../components/context/Global";
import "@testing-library/jest-dom";

// Mock the getQuestion function from DmpRedactionApi
jest.mock("../services/DmpRedactionApi", () => ({
  getQuestion: jest.fn(),
}));

const sampleData = {
  plan: {
    id: 1,
    research_outputs: [
      { id: 1, abbreviation: "RO1" },
      { id: 2, abbreviation: "RO2" },
      { id: 3, abbreviation: "RO3" },
    ],
  },
};

const globalState = {
  form: null,
  setForm: jest.fn(),
  searchProduct: {},
  setSearchProduct: jest.fn(),
};

describe("RedactionLayout component", () => {
  beforeEach(() => {
    getQuestion.mockImplementation(() => Promise.resolve({ data: sampleData }));
  });

  it("renders the component and fetches data", async () => {
    render(
      <GlobalContext.Provider value={globalState}>
        <RedactionLayout />
      </GlobalContext.Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Expect loading spinner to be removed
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

    // Expect tabs to be rendered with fetched data
    expect(screen.getByText("RO1")).toBeInTheDocument();
    expect(screen.getByText("RO2")).toBeInTheDocument();
    expect(screen.getByText("RO3")).toBeInTheDocument();
  });

  it("handles pagination and tab changes correctly", async () => {
    render(
      <GlobalContext.Provider value={globalState}>
        <RedactionLayout />
      </GlobalContext.Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Click on the second tab (RO2)
    fireEvent.click(screen.getByText("RO2"));

    // Expect the second tab to be active
    const tabRO2 = screen.getByText("RO2");
    // eslint-disable-next-line testing-library/no-node-access
    expect(tabRO2.closest("li")).toHaveClass("active");

    // Click on the third tab (RO3)
    fireEvent.click(screen.getByText("RO3"));

    // Expect the third tab to be active
    const tabRO3 = screen.getByText("RO3");
    // eslint-disable-next-line testing-library/no-node-access
    expect(tabRO3.closest("li")).toHaveClass("active");
  });
});
