import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import ModalRecommandation from "../components/redaction/ModalRecommandation";
import { getRecommandation } from "../services/DmpRecommandationApi";

// Mock the getRecommandation function from DmpRecommandationApi
jest.mock("../services/DmpRecommandationApi", () => ({
  getRecommandation: jest.fn(),
}));

const sampleData = [
  {
    titre: "Science Europe",
    description: "<p>Sample description for Science Europe</p>",
  },
  {
    titre: "Horizon Europe",
    description: "<p>Sample description for Horizon Europe</p>",
  },
];

describe("ModalRecommandation component", () => {
  beforeEach(() => {
    getRecommandation.mockImplementation(() => Promise.resolve({ data: sampleData }));
  });

  it("renders the component and fetches data", async () => {
    const setShowModalRecommandation = jest.fn();
    const setFillColorBell = jest.fn();
    render(<ModalRecommandation show={true} setshowModalRecommandation={setShowModalRecommandation} setFillColorBell={setFillColorBell} />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Expect tabs to be rendered with fetched data
    expect(screen.getByText("Science Europe")).toBeInTheDocument();
    expect(screen.getByText("Horizon Europe")).toBeInTheDocument();
  });

  it("switches between tabs and displays content correctly", async () => {
    const setShowModalRecommandation = jest.fn();
    const setFillColorBell = jest.fn();

    render(<ModalRecommandation show={true} setshowModalRecommandation={setShowModalRecommandation} setFillColorBell={setFillColorBell} />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    fireEvent.click(screen.getByText("Horizon Europe"));

    // Expect the content of the active tab to be displayed
    expect(screen.getByText("Sample description for Horizon Europe")).toBeInTheDocument();
    expect(screen.queryByText("Sample description for Science Europe")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Science Europe"));

    // Expect the content of the active tab to be displayed
    expect(screen.getByText("Sample description for Science Europe")).toBeInTheDocument();
    expect(screen.queryByText("Sample description for Horizon Europe")).not.toBeInTheDocument();
  });

  it("closes the modal when clicking the close button", async () => {
    const setShowModalRecommandation = jest.fn();
    const setFillColorBell = jest.fn();

    render(<ModalRecommandation show={true} setshowModalRecommandation={setShowModalRecommandation} setFillColorBell={setFillColorBell} />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    fireEvent.click(screen.getByText("x"));
    expect(setShowModalRecommandation).toHaveBeenCalledWith(false);
    expect(setFillColorBell).toHaveBeenCalledWith("var(--primary)");
  });
});
