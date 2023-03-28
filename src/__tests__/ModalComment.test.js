import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ModalComment from "../components/redaction/ModalComment.jsx";
import { getComments, postNote, updateNote } from "../services/DmpComentApi";

// Test if the component renders without crashing.
// Test if the component fetches comments correctly.

jest.mock("../services/DmpComentApi", () => ({
  getComments: jest.fn(),
  postNote: jest.fn(),
  updateNote: jest.fn(),
}));

const mockData = [
  // data here
];

describe("ModalComment component", () => {
  beforeEach(() => {
    getComments.mockResolvedValue({ data: mockData });
  });

  test("renders without crashing", async () => {
    render(<ModalComment show={true} />);
    await waitFor(() => expect(getComments).toHaveBeenCalledTimes(1));
  });
});
