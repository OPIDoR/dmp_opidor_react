import React from "react";
import styles from "../assets/css/navbar.module.css";
import ReasearchSVG from "../Styled/svg/ReasearchSVG";
import ContributorSVG from "../Styled/svg/ContributorSVG";
import AssistanceSVG from "../Styled/svg/AssistanceSVG";
import BudgetSVG from "../Styled/svg/BudgetSVG";
import RedactionSVG from "../Styled/svg/RedactionSVG";
import DownloadSVG from "../Styled/svg/DownloadSVG";
import ShareSVG from "../Styled/svg/ShareSVG";
import InfoSVG from "../Styled/svg/InfoSVG";

function Navbar() {
  return (
    <ul id="plan_navigation" className={`nav nav-tabs ${styles.plan_navigation}`} role="tablist">
      <li
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <a href="#">
          <InfoSVG />
          Informations générales
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <a href="#">
          <ReasearchSVG />
          Produits de recherche
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={styles.active}
      >
        <a href="#">
          <RedactionSVG />
          Rédiger
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <a href="#">
          <ContributorSVG />
          Contributeurs
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <a href="#">
          <BudgetSVG />
          Budget
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <a href="#">
          <ShareSVG />
          Partager
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <a href="#">
          <AssistanceSVG></AssistanceSVG>
          Demande d'assistance
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
      <li
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <a href="#">
          <DownloadSVG></DownloadSVG>
          Télécharger
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
    </ul>
  );
}

export default Navbar;
