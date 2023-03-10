import React from "react";
import styles from "../assets/css/header.module.css";

function Header() {
  return (
    <header>
      <div className={styles.header}>
        <nav>
          <ul className={styles.list}>
            <li className={styles.item}>
              <img className={styles.logo} src="../assets/images/logo.png" alt="banner" />
            </li>
            <li className={styles.item}>AIDE EN LIGNE</li>
            <li className={`${styles.item} ${styles.dot}`} />
            <li className={styles.item}>PGD ET MODEL</li>
            <li className={`${styles.item} ${styles.dot}`} />
            <li className={styles.item}>APPROFONDIR</li>
            <li className={styles.item}>
              <button className={styles.button}>MON ESPACE</button>
            </li>
            <li className={styles.item}>FR / ENG</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
