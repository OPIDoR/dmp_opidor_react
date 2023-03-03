import React from "react";

function Header() {
  return (
    <header>
      <div className="header">
        <nav>
          <ul className="list">
            <li className="item">
              <img className="logo" src="/assets/images/logo.png" alt="banner" />
            </li>
            <li className="item">AIDE EN LIGNE</li>
            <li className="item dot" />
            <li className="item">PGD ET MODEL</li>
            <li className="item dot" />
            <li className="item">APPROFONDIR</li>
            <li className="item">
              <button className="button">MON ESPACE</button>
            </li>
            <li className="item">FR / ENG</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
