import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import WritePlan from "../components/WritePlan/WritePlan";
import { getQuestion } from "../services/DmpRedactionApi";
import { GlobalContext } from "../components/context/Global";
import "@testing-library/jest-dom";

// Mock the getQuestion function from DmpRedactionApi
jest.mock("../services/DmpRedactionApi", () => ({
  getQuestion: jest.fn(),
}));

const sampleData = [
  { id: 1, abbreviation: "Product 1", metadata: { hasPersonalData: false } },
  { id: 2, abbreviation: "Product 2", metadata: { hasPersonalData: true } },
];

const globalState = {
  researchOutputs: {},
  setForm: jest.fn(),
  setResearchOutputId: jest.fn(),
  researchOutputsData: sampleData,
  setResearchOutputsData: jest.fn(),
};

describe("WritePlan", () => {
  beforeEach(() => {
    getQuestion.mockResolvedValue({
      data: {
        plan: {
          id: 1,
          research_outputs: sampleData,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component and fetches data", async () => {
    render(
      <GlobalContext.Provider value={globalState}>
        <WritePlan />
      </GlobalContext.Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Expect loading spinner to be removed
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    // Expect tabs to be rendered with fetched data
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("handles pagination and tab changes correctly", async () => {
    render(
      <GlobalContext.Provider value={globalState}>
        <WritePlan />
      </GlobalContext.Provider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Click on the second tab (RO2)
    fireEvent.click(screen.getByText("Product 1"));
    // Expect the second tab to be active
    const tabRO2 = screen.getByText("Product 1");
    // eslint-disable-next-line testing-library/no-node-access
    expect(tabRO2.closest("li")).toHaveClass("active");
    // Click on the third tab (RO3)
    fireEvent.click(screen.getByText("Product 2"));
    // Expect the third tab to be active
    const tabRO3 = screen.getByText("Product 2");
    // eslint-disable-next-line testing-library/no-node-access
    expect(tabRO3.closest("li")).toHaveClass("active");
  });
});
