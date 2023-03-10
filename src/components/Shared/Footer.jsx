import React from "react";
import styles from "../assets/css/footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="row">
        <div className="col-md-3 first-row">
          <div className="mb-2">
            <img className={styles.logo_gris} src="../assets/images/8.png" alt="image" />
            <p className={styles.description}>
              vous aide à lorem ipsums simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
              text ever since the 1500s, when an unknown printer took a galley of type and scrambled.
            </p>
            <div className="social">
              <p>© 2016 - 2022 Inist-CNRS • V3.3.1</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div>
            <h6 className={styles.title}>NAVIGATION</h6>
            <ul>
              <li className={styles.item_footer}>Aide en ligne</li>
              <li className={styles.item_footer}>PGD &amp; Modèles</li>
              <li className={styles.item_footer}>Approfondir</li>
              <li className={styles.item_footer}>Support technique / FAQ</li>
              <li className={styles.item_footer}>Actualités</li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div>
            <h6 className={styles.title}>A PROPOS</h6>
            <ul>
              <li className={styles.item_footer}>A propos de DMP OPIDoR</li>
              <li className={styles.item_footer}>Conditions Générales d’Utilisation</li>
              <li className={styles.item_footer}>Politique de cookies</li>
              <li className={styles.item_footer}>
                Github
                <img className={styles.icon_footer} src="../assets/images/github.png" alt="" />
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div>
            <h6 className={styles.title}>ECOSYSTEM</h6>
            <ul>
              <li className={styles.item_footer}>
                <img src="../assets/images/9.png" alt="" className={styles.logo_gris} />
              </li>
              <li className={styles.item_footer}>
                <img src="../assets/images/republique.png" className={styles.logo_republique} alt="" />
                recherche.data.gouv.fr
              </li>
              <li className={styles.item_footer}></li>
              <li className={styles.item_footer}>
                <img className={styles.icon_footer} src="../assets/images/twitter.png" alt="" />
                <img className={styles.icon_footer} src="../assets/images/messages.png" alt="" />
                <img src="../assets/images/cnrs.png" alt="" className={styles.logo_cnrs} />
                <img src="../assets/images/roadmap.png" alt="" className={styles.logo_road} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
