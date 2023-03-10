import React from "react";
import styles from "../assets/css/banner.module.css";

function Banner() {
  return (
    <section>
      <div className={styles.banner}>
        <img className={styles.banner_logo} src="/assets/images/banner.png" alt="image" />
        <div className={styles.banner_content}>
          <div className={styles.banner_warning}>
            <span>
              <a className={styles.warning_icon} href="#">
                <i className="fas fa-exclamation-triangle" />
              </a>
            </span>
            <span className={styles.banner_span}>
              Attention Mise à jour prévue le 2 novembre 2022, votre outil préféré sera indisponible jusqu’à 10h.
            </span>
          </div>
          <div className={styles.banner_main}>
            <div className={styles.banner_flex}>
              <img src="/assets/images/inrae.png" alt="" />
              <div className={styles.banner_details}>
                <div>
                  <span>
                    <a className="" href="#">
                      <i className="fas fa-envelope" />
                    </a>
                  </span>
                  <span className={styles.banner_span}>Contact</span>
                </div>

                <div>
                  <span>
                    <a className="" href="#">
                      <i className="fas fa-globe" />
                    </a>
                  </span>
                  <span className={styles.banner_span}>Gestion et partage des données scientifiques</span>
                </div>
                <div>
                  <span>
                    <a className="" href="#">
                      <i className="fas fa-globe" />
                    </a>
                  </span>
                  <span className={styles.banner_span}>Portail Data INRAE</span>
                </div>
              </div>
            </div>
            <div className={styles.banner_details}>
              Pour être alerté.e des actualités sur DMP OPIDoR et les modèles de plans, rejoignez le groupe de messagerie DMPOPIDoR@inrae.fr
              11.05.2022 - <strong>Mise à jour des modèles de plan de gestion de données INRAE</strong> pour les projets et pour ls structures :
              chapitres «<strong>Sensibilité des données</strong>» (auparavant : «Confidentialité») et «
              <strong>Stockage et sécurité des données</strong>», ainsi que des recommandations associées.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
