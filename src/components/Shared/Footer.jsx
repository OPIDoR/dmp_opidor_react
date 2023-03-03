import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="row">
        <div className="col-md-3 first-row">
          <div className="mb-2">
            <img className="logo-gris" src="/assets/images/8.png" alt="image" />
            <p className="description">
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
            <h6 className="title">NAVIGATION</h6>
            <ul className="list-footer">
              <li className="item-footer">Aide en ligne</li>
              <li className="item-footer">PGD &amp; Modèles</li>
              <li className="item-footer">Approfondir</li>
              <li className="item-footer">Support technique / FAQ</li>
              <li className="item-footer">Actualités</li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div>
            <h6 className="title">A PROPOS</h6>
            <ul className="list-footer">
              <li className="item-footer">A propos de DMP OPIDoR</li>
              <li className="item-footer">Conditions Générales d’Utilisation</li>
              <li className="item-footer">Politique de cookies</li>
              <li className="item-footer">
                Github
                <img className="icon-footer" src="/assets/images/github.png" alt="" />
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div>
            <h6 className="title">ECOSYSTEM</h6>
            <ul className="list-footer">
              <li className="item-footer">
                <img src="/assets/images/9.png" alt="" className="logo-gris" />
              </li>
              <li className="item-footer">
                <img src="/assets/images/republique.png" className="logo-republique" alt="" />
                recherche.data.gouv.fr
              </li>
              <li className="item-footer"></li>
              <li className="item-footer">
                <img className="icon-footer" src="/assets/images/twitter.png" alt="" />
                <img className="icon-footer" src="/assets/images/messages.png" alt="" />
                <img src="/assets/images/cnrs.png" alt="" className="logo-cnrs" />
                <img src="/assets/images/roadmap.png" alt="" className="logo-road" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
