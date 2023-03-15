import React from "react";
import infoSvg from "../assets/images/svg/infoSvg.svg";
import researchSvg from "../assets/images/svg/researchSvg.svg";
import redactionSvg from "../assets/images/svg/redactionSvg.svg";
import contributorSvg from "../assets/images/svg/contributorSvg.svg";
import budgetSvg from "../assets/images/svg/budgetSvg.svg";
import shareSvg from "../assets/images/svg/shareSvg.svg";
import assistanceSvg from "../assets/images/svg/assistanceSvg.svg";
import downloadSvg from "../assets/images/svg/downloadSvg.svg";
import styles from "../assets/css/navbar.module.css";

function Navbar() {
  return (
    <ul id="plan_navigation" className={`nav nav-tabs ${styles.plan_navigation}`} role="tablist">
      <li>
        <a href="#">
          {/* <span className="icon icon-general-infos" /> */}
          <img src={infoSvg} alt="" className={styles.icon_navbar} />
          Informations générales
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li>
        <a href="#">
          <img src={researchSvg} alt="" className={styles.icon_navbar} />
          Produits de recherche
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li className={styles.active}>
        <a href="#">
          <img src={redactionSvg} alt="" className={styles.icon_navbar} />
          Rédiger
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li>
        <a href="#">
          <img src={contributorSvg} alt="" className={styles.icon_navbar} />
          Contributeurs
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li>
        <a href="#">
          <img src={budgetSvg} alt="" className={styles.icon_navbar} />
          Budget
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li>
        <a href="#">
          <img src={shareSvg} alt="" className={styles.icon_navbar} />
          Partager
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li>
        <a href="#">
          <img src={assistanceSvg} alt="" className={styles.icon_navbar} />
          Demande d'assistance
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li>
        <a href="#">
          <img src={downloadSvg} alt="" className={styles.icon_navbar} />
          Télécharger
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
    </ul>
  );
}

export default Navbar;
