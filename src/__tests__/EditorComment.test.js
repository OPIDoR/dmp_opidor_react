import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EditorComment from "../components/redaction/EditorComment";
import { Editor } from "@tinymce/tinymce-react";

jest.mock("@tinymce/tinymce-react", () => {
  return {
    Editor: ({ onEditorChange, initialValue }) => {
      return <textarea defaultValue={initialValue} onChange={(e) => onEditorChange(e.target.value)} data-testid="mock-editor" />;
    },
  };
});

describe("EditorComment component", () => {
  test("renders without crashing", () => {
    const updateParentText = jest.fn();
    render(<EditorComment initialValue="Initial text" updateParentText={updateParentText} />);
  });

  test("calls updateParentText on editor change", () => {
    const updateParentText = jest.fn();
    render(<EditorComment initialValue="Initial text" updateParentText={updateParentText} />);

    const mockEditor = screen.getByTestId("mock-editor");
    fireEvent.change(mockEditor, { target: { value: "Updated text" } });

    expect(updateParentText).toHaveBeenCalledTimes(1);
    expect(updateParentText).toHaveBeenCalledWith("Updated text");
  });
});
