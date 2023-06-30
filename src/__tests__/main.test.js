import React from "react";
import { act } from "react-dom/test-utils";
import { render, fireEvent, screen } from "@testing-library/react";
import Plan from "../components/PlanCreation/PlanCreation";
import Global from "../components/context/Global";
import { shallow } from "enzyme";
import i18n from "../i18nTest";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { configure } from "enzyme";
configure({ adapter: new Adapter() });

describe("Main component", () => {
  it("renders header, banner, first step, and footer", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <Global>
          <Plan />
        </Global>
      );
    });

    expect(screen.getByText("Indiquez le contexte de votre DMP")).toBeInTheDocument();
    expect(screen.getByText("Projet de recherche")).toBeInTheDocument();
    expect(screen.getByText("Structure de recherche")).toBeInTheDocument();
  });

  it('renders second step when "Next" button is clicked', async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <Global>
          <Plan />
        </Global>
      );
    });

    //wrap the click event in act as well
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByText("Valider mon choix"));
    });

    expect(screen.getByText("Choisissez votre modèle")).toBeInTheDocument();
  });
});
