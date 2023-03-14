import React from "react";
import infoSvg from "../assets/images/svg/infoSvg.svg";
// import researchSvg from "../assets/images/svg/researchSvg.svg";
// import redactionSvg from "../assets/images/svg/redactionSvg.svg";
import contributorSvg from "../assets/images/svg/contributorSvg.svg";
// import budgetSvg from "../assets/images/svg/budgetSvg.svg";
// import shareSvg from "../assets/images/svg/shareSvg.svg";
// import assistanceSvg from "../assets/images/svg/assistanceSvg.svg";
// import download from "../assets/images/svg/download.svg";

function Navbar() {
  return (
    <ul id="plan-navigation" className="nav nav-tabs plan-navigation" role="tablist">
      <li role="presentation" className>
        <a href="#" role="tab" aria-controls="content">
          {/* <span className="icon icon-general-infos" /> */}
          <img src={infoSvg} alt="" className="icon_navbar" />
          Informations générales
        </a>
        <span className="active-line" />
        <span className="active-bullet">●</span>
      </li>
      <li role="presentation" className>
        <a href="#" role="tab" aria-controls="content">
          <img src={infoSvg} alt="" className="icon_navbar" />
          Produits de recherche
        </a>
        <span className="active-line" />
        <span className="active-bullet">●</span>
      </li>
      <li role="presentation" className="phase-tab active">
        <a href="#" role="tab" aria-controls="content">
          <img src={infoSvg} alt="" className="icon_navbar" />
          Rédiger
        </a>
        <span className="active-line" />
        <span className="active-bullet">●</span>
      </li>
      <li role="contributors" className>
        <a href="#" role="tab" aria-controls="content">
          <img src={contributorSvg} alt="" className="icon_navbar" />
          Contributeurs
        </a>
        <span className="active-line" />
        <span className="active-bullet">●</span>
      </li>
      <li role="budget" className>
        <a href="#" role="tab" aria-controls="content">
          <img src={infoSvg} alt="" className="icon_navbar" />
          Budget
        </a>
        <span className="active-line" />
        <span className="active-bullet">●</span>
      </li>
      <li role="presentation" className>
        <a href="#" role="tab" aria-controls="content">
          <img src={infoSvg} alt="" className="icon_navbar" />
          Partager
        </a>
        <span className="active-line" />
        <span className="active-bullet">●</span>
      </li>
      <li role="presentation" className>
        <a href="#" role="tab" aria-controls="content">
          <img src={infoSvg} alt="" className="icon_navbar" />
          Télécharger
        </a>
        <span className="active-line" />
        <span className="active-bullet">●</span>
      </li>
      <li role="presentation" className>
        <a href="#" role="tab" aria-controls="content">
          <img src={infoSvg} alt="" className="icon_navbar" />
          Télécharger
        </a>
        <span className="active-line" />
        <span className="active-bullet">●</span>
      </li>
    </ul>
  );
}

export default Navbar;
