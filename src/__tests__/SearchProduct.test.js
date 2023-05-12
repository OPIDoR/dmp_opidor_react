import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchProduct from "../components/SearchProduct/SearchProduct.jsx";
import { GlobalContext } from "../components/context/Global";
import { getTypeSearchProduct, postSearchProduct } from "../services/DmpSearchProduct";

jest.mock("../services/DmpSearchProduct");

const mockHandleClose = jest.fn();

const renderSearchProduct = () =>
  render(
    <GlobalContext.Provider value={{ setProductData: jest.fn() }}>
      <SearchProduct planId={1} handleClose={mockHandleClose} show={true} />
    </GlobalContext.Provider>
  );

describe("SearchProduct component", () => {
  beforeEach(() => {
    getTypeSearchProduct.mockResolvedValue({
      data: [{ fr_FR: "Type 1", en_GB: "Type 1" }],
    });
  });

  it("renders the component and loads type options", async () => {
    renderSearchProduct();

    expect(screen.getByText("Produit de recherche")).toBeInTheDocument();

    await waitFor(() => expect(getTypeSearchProduct).toHaveBeenCalledTimes(1));
  });

  it("handles input changes and save button", async () => {
    renderSearchProduct();

    fireEvent.change(screen.getByPlaceholderText("ajouter abbreviation"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByPlaceholderText("ajouter titre"), { target: { value: "Test Title" } });
    fireEvent.click(screen.getByText("No"));

    expect(screen.getByPlaceholderText("ajouter abbreviation")).toHaveValue("test");
    expect(screen.getByPlaceholderText("ajouter titre")).toHaveValue("Test Title");

    postSearchProduct.mockResolvedValue({
      data: { plan: { research_outputs: [] } },
    });

    fireEvent.click(screen.getByText("Ajouter"));

    await waitFor(() => expect(postSearchProduct).toHaveBeenCalledTimes(1));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
