import React from "react";

function Banner() {
  return (
    <section>
      <div className="banner">
        <img className="banner-logo" src="/assets/images/banner.png" alt="image" />
        <div className="banner-content">
          <div className="banner-warning">
            <i className="fas fa-exclamation-triangle warning-icon"></i>
            <span className="banner-span">Attention Mise à jour prévue le 2 novembre 2022, votre outil préféré sera indisponible jusqu’à 10h.</span>
          </div>
          <div className="banner-main">
            <div className="banner-flex">
              <img src="/assets/images/inrae.png" alt="" />
              <div className="banner-details">
                <div>
                  <i className="fas fa-envelope"></i>
                  <span className="banner-span">Contact</span>
                </div>

                <div>
                  <i className="fas fa-globe"></i>
                  <span className="banner-span">Gestion et partage des données scientifiques</span>
                </div>
                <div>
                  <i className="fas fa-globe"></i>
                  <span className="banner-span">Portail Data INRAE</span>
                </div>
              </div>
            </div>
            <div className="banner-details">
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
