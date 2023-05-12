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
import { useTranslation } from "react-i18next";

function Navbar() {
  const { t } = useTranslation();
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
          {t("Informations générales")}
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
          {t("Research products")}
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
          {t("Rédiger")}
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
          {t("Contributors")}
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
          {t("Budget")}
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
          {t("Partager")}
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
          {t("Request for assistance")}
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
          {t("Download")}
        </a>
        <span className={styles.active_line} />
        <span className={styles.active_bullet}>●</span>
      </li>
    </ul>
  );
}

export default Navbar;
