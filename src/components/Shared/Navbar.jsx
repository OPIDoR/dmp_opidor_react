import React, { useEffect, useState } from "react";
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
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  // A map of paths to tab indices:
  const pathMap = {
    "/": 0,
    "/redaction": 2,
  };

  /* This code is using the `useEffect` hook to update the active tab in the navbar based on the current path in the URL. It listens for changes to the
`location.pathname` property and updates the `activeTab` state variable using the `setActiveTab` function. The `pathMap` object is used to map
specific paths to tab indices, so that the correct tab is highlighted when the user navigates to a specific page. */
  useEffect(() => {
    // Set the active tab based on the current path:
    setActiveTab(pathMap[location.pathname] || 0);
  }, [location.pathname]);

  return (
    <ul id="plan_navigation" className={`nav nav-tabs ${styles.plan_navigation}`} role="tablist">
      {[
        { to: "/", svg: <InfoSVG />, text: t("Informations générales") },
        { to: "#", svg: <ReasearchSVG />, text: t("Research products") },
        { to: "/redaction", svg: <RedactionSVG />, text: t("Redact") },
        { to: "#", svg: <ContributorSVG />, text: t("Contributors") },
        { to: "#", svg: <BudgetSVG />, text: t("Budget") },
        { to: "#", svg: <ShareSVG />, text: t("Partager") },
        { to: "#", svg: <AssistanceSVG />, text: t("Request for assistance") },
        { to: "#", svg: <DownloadSVG />, text: t("Download") },
      ].map(({ to, svg, text }, index) => (
        <li
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setActiveTab(index);
          }}
          className={index === activeTab ? styles.active : null}
        >
          <Link to={to}>
            {svg}
            {text}
          </Link>
          <span className={styles.active_line} />
          <span className={styles.active_bullet}>●</span>
        </li>
      ))}
    </ul>
  );
}

export default Navbar;
