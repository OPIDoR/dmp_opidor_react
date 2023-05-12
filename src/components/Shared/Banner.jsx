import React from "react";
import styles from "../assets/css/banner.module.css";
import Info from "../Styled/Info";
import bannerImage from "../assets/images/banner.png";
import inraeImage from "../assets/images/inrae.png";
import { BsEnvelopeFill, BsGlobe } from "react-icons/bs";
import { useTranslation } from "react-i18next";

function Banner() {
  const { t } = useTranslation();
  return (
    <section>
      <div className={styles.banner}>
        <img className={styles.banner_logo} src={bannerImage} alt="image" />
        <div className={styles.banner_content}>
          <Info
            text={t("Attention Update scheduled for November 2, 2022, your favorite tool will be unavailable until 10 a.m.")}
            icon="fas fa-exclamation-triangle"
            type="warning"
          ></Info>
          <div className={styles.banner_main}>
            <div className={styles.banner_flex}>
              <img src={inraeImage} alt="" />
              <div className={styles.banner_details}>
                <div>
                  <BsEnvelopeFill size={20} />
                  <span className={styles.banner_span}>{t("Contact")}</span>
                </div>

                <div>
                  <BsGlobe size={20} />
                  <span className={styles.banner_span}>{t("Management and sharing of scientific data")}</span>
                </div>
                <div>
                  <BsGlobe size={20} />
                  <span className={styles.banner_span}>{t("INRAE Data Portal")}</span>
                </div>
              </div>
            </div>
            <div className={styles.banner_details}>
              {t("To be alerted to news on DMP OPIDoR and plan models, join the messaging group")} DMPOPIDoR@inrae.fr 11.05.2022 -{" "}
              <strong>{t("Update of INRAE data management plan templates")}</strong> {t("for projects and for structures: chapters")}{" "}
              <strong>«{t("Data sensitivity")}</strong>» ({t("formerly")}
              {" : "}«{t("Confidentiality")}»)
              <strong>
                {" "}
                {t("and")}
                {" «"}
                {t("Data storage and security")}
              </strong>
              », {t("as well as associated recommendations")}.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
