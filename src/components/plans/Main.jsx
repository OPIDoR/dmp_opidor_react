import React, { useState } from "react";
import Banner from "../Shared/Banner";
import Footer from "../Shared/Footer";
import Header from "../Shared/Header";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import styles from "../assets/css/main.module.css";
import Info from "../Styled/Info";

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
      <div className={styles.main}>
        <Info text="Message à l’attention de l’utilisateur l’informant de la manipulation faite." icon="fas fa-info-circle" type="info"></Info>
        <div className={styles.card_articles}>
          {firstStep && <FirstStep handleNextStep={handleNextStep}></FirstStep>}
          {secondStep && <SecondStep></SecondStep>}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Main;
