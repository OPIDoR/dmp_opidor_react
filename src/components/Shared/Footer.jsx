import React from "react";
import styles from "../assets/css/footer.module.css";
import { BsTwitter, BsWechat } from "react-icons/bs";
import { BsGithub } from "react-icons/bs";
import cnrs from "../assets/images/cnrs.png";
import roadmap from "../assets/images/roadmap.png";
import republique from "../assets/images/republique.png";
import a from "../assets/images/9.png";
import b from "../assets/images/8.png";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className="row">
        <div className="col-md-3 first-row">
          <div className="mb-2">
            <img className={styles.logo_gris} src={b} alt="image" />
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
            <h6 className={styles.title}>{t("NAVIGATION")}</h6>
            <ul>
              <li className={styles.item_footer}>{t("Online help")}</li>
              <li className={styles.item_footer}>{t("PGD and Models")}</li>
              <li className={styles.item_footer}>{t("Deepen")}</li>
              <li className={styles.item_footer}>{t("Technical support / FAQs")}</li>
              <li className={styles.item_footer}>{t("News")}</li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div>
            <h6 className={styles.title}>A PROPOS</h6>
            <ul>
              <li className={styles.item_footer}>{t("About DMP OPIDoR")}</li>
              <li className={styles.item_footer}>{t("Terms of Service")}</li>
              <li className={styles.item_footer}>{t("Cookies policy")}</li>
              <li className={styles.item_footer}>
                Github
                <BsGithub size={30} className={styles.icon_footer} />
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div>
            <h6 className={styles.title}>{t("ECOSYSTEM")}</h6>
            <ul>
              <li className={styles.item_footer}>
                <img src={a} alt="" className={styles.logo_gris} />
              </li>
              <li className={styles.item_footer}>
                <img src={republique} className={styles.logo_republique} alt="" />
                recherche.data.gouv.fr
              </li>
              <li className={styles.item_footer}></li>
              <li className={styles.item_footer_last}>
                <BsTwitter size={30} className={styles.icon_footer} />
                <BsWechat size={30} className={styles.icon_footer} />
                <img src={cnrs} alt="" className={styles.logo_cnrs} />
                <img src={roadmap} alt="" className={styles.logo_road} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
