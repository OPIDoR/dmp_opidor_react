import React from "react";
import styles from "../assets/css/header.module.css";
import logo from "../assets/images/logo.png";
import { useTranslation } from "react-i18next";

function Header() {
  const { t, i18n } = useTranslation();

  /**
   * It changes the language of the app to the language that the user selects
   * @param l - The language you want to change to.
   */
  const handleChangeL = (l) => {
    i18n.changeLanguage(l);
  };
  return (
    <header>
      <div className={styles.header}>
        <nav>
          <ul className={styles.list}>
            <li className={styles.item}>
              <img className={styles.logo} src={logo} alt="banner" />
            </li>
            <li className={styles.item}> {t("ONLINE HELP")}</li>
            <li className={`${styles.item} ${styles.dot}`} />
            <li className={styles.item}>{t("ONLINE HELP")}</li>
            <li className={`${styles.item} ${styles.dot}`} />
            <li className={styles.item}>{t("DEEPEN")}</li>
            <li className={styles.item}>
              <button className={styles.button}>{t("MY SPACE")}</button>
            </li>
            <li className={styles.item}>
              <a href="#" onClick={() => handleChangeL("fr")}>
                FR
              </a>{" "}
              /{" "}
              <a href="#" onClick={() => handleChangeL("en")}>
                ENG
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
