import React, { useState } from "react";
import Banner from "../Shared/Banner";
import Footer from "../Shared/Footer";
import Header from "../Shared/Header";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";

function Main() {
  const [firstStep, setfirstStep] = useState(true);
  const [secondStep, setsecondStep] = useState(false);

  /**
   * When the user clicks the button, the first step is set to false and the second step
   * is set to true.
   */
  const handleNextStep = () => {
    setfirstStep(!firstStep);
    setsecondStep(!secondStep);
  };

  return (
    <>
      <Header></Header>
      <Banner></Banner>
      <div className="main">
        <div className="banner-info">
          <i className="fas fa-info-circle info-icon"></i>
          <span className="banner-span">Message à l’attention de l’utilisateur l’informant de la manipulation faite.</span>
        </div>
        <div className="card-articles">
          {firstStep && <FirstStep handleNextStep={handleNextStep}></FirstStep>}
          {secondStep && <SecondStep></SecondStep>}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Main;
