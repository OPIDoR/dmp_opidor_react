import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Main from "../components/plans/Main";
import Global from "../components/context/Global";
import { shallow } from "enzyme";

import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";
configure({ adapter: new Adapter() });

describe("Main component", () => {
  it("renders header, banner, first step, and footer", () => {
    render(
      <Global>
        <Main />
      </Global>
    );

    //render
    expect(screen.getByText("Indiquez le contexte de votre DMP")).toBeInTheDocument();
    expect(screen.getByText("Projet de recherche")).toBeInTheDocument();
    expect(screen.getByText("Structure de recherche")).toBeInTheDocument();
  });

  it('renders second step when "Next" button is clicked', () => {
    render(
      <Global>
        <Main />
      </Global>
    );
    fireEvent.click(screen.getByText("Valider mon choix"));
    expect(screen.getByText("Choisissez votre modèle")).toBeInTheDocument();
  });
});
