import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResearchOutputModal from "../components/ResearchOutput/ResearchOutputModal";
import { GlobalContext } from "../components/context/Global";
import { getTypeResearchOutput, postResearchOutput } from "../services/DmpResearchOutput";

jest.mock("../services/DmpResearchOutput");

const mockHandleClose = jest.fn();

const renderResearchOutput = () =>
  render(
    <GlobalContext.Provider value={{ setResearchOutputsData: jest.fn() }}>
      <ResearchOutputModal planId={1} handleClose={mockHandleClose} show={true} />
    </GlobalContext.Provider>
  );

describe("ResearchOutputModal component", () => {
  beforeEach(() => {
    getTypeResearchOutput.mockResolvedValue({
      data: [{ fr_FR: "Type 1", en_GB: "Type 1" }],
    });
  });

  it("renders the component and loads type options", async () => {
    renderResearchOutput();

    expect(screen.getByText("Produit de recherche")).toBeInTheDocument();

    await waitFor(() => expect(getTypeResearchOutput).toHaveBeenCalledTimes(1));
  });

  it("handles input changes and save button", async () => {
    renderResearchOutput();

    fireEvent.change(screen.getByPlaceholderText("ajouter abbreviation"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("ajouter titre"), { target: { value: "Test Title" } });
    fireEvent.click(screen.getByText("No"));

    expect(screen.getByPlaceholderText("ajouter abbreviation")).toHaveValue("test");
    expect(screen.getByPlaceholderText("ajouter titre")).toHaveValue("Test Title");

    postResearchOutput.mockResolvedValue({
      data: { plan: { research_outputs: [] } },
    });

    fireEvent.click(screen.getByText("Ajouter"));

    await waitFor(() => expect(postResearchOutput).toHaveBeenCalledTimes(1));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
