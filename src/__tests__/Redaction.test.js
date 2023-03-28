import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Redaction from "../components/redaction/Redaction";
import { getQuestion } from "../services/DmpRedactionApi";
import Global from "../components/context/Global";

jest.mock("../services/DmpRedactionApi.js");

// This test file covers the following test cases:

// The Redaction component renders without crashing.
// The component displays questions when data is fetched from the API.
// The question panel toggles when clicked.

const mockSectionsData = {
  data: {
    sections: [
      {
        number: 1,
        title: "Section 1",
        questions: [
          {
            number: 1,
            text: "Question 1",
            id: "q1",
            madmp_schema_id: "schema1",
          },
          {
            number: 2,
            text: "Question 2",
            id: "q2",
            madmp_schema_id: "schema2",
          },
        ],
      },
    ],
  },
};

describe("Redaction component", () => {
  beforeEach(() => {
    getQuestion.mockResolvedValue(mockSectionsData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(
      <Global>
        <Redaction researchId="1" planId="1" />
      </Global>
    );
  });

  test("displays questions when data is fetched", async () => {
    render(
      <Global>
        <Redaction researchId="1" planId="1" />
      </Global>
    );
    await screen.findByText("1. Section 1");
    expect(screen.getByText("1.1")).toBeInTheDocument();
    expect(screen.getByText("1.2")).toBeInTheDocument();
  });

  test("toggles question panel when clicked", async () => {
    render(
      <Global>
        <Redaction researchId="1" planId="1" />
      </Global>
    );
    await screen.findByText("1. Section 1");
    const panelTitle = screen.getByText("1.1");
    fireEvent.click(panelTitle);
    await screen.findByText("Question 1");
    fireEvent.click(panelTitle);
  });
});
