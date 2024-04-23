import styled from "styled-components";

const ResearchOutputsNavBar = styled.nav`
  background-color: white;
  width: 220px;
  height: 100%;
  float: left;
  z-index: 0;
  margin-bottom: 0px;
  border-radius: 0px 0px 0px 0px;
  float: left;
  position: sticky;
  top: 100px;

  .navbar-nav {
    margin: 0px 0px 0px 0px;
  }

  /*adds border top to first nav box */
  .navbar-nav > li:first-child {
    border-top: 0px #e5e5e5 solid;
    border-radius: 20px 0 0 0;
  }

  .navbar-nav > li a {
    height: 65px;
    padding: 10px 0 10px 0;
    box-sizing: border-box;
  }

  .navbar-nav > li:not(:first-child) > a {
    border-radius: 0;
  }

  /*adds border to bottom nav boxes*/
  .navbar-nav > li {
    border-bottom: 3px var(--white) solid;
  }

  /* ******************* active ******************************* */
  .navbar-nav > .active:first-child > a {
    background-color: #1c5170 !important;
  }

  .navbar-nav > .active:not(:first-child):not(:last-child) > a {
    background-color: #1c5170 !important;
  }

  .navbar-nav > .active:not(:first-child) > a {
    background-color: #1c5170 !important;
  }
  /* ************************************************** */

  /* *********************** hover *************************** */
  .navbar-nav > li:first-child:hover {
    background-color: #1c5170;
  }

  .navbar-nav > li:not(:first-child):not(:last-child):hover {
    background-color: #1c5170;
    border-radius: 0px;
  }

  .navbar-nav > li:last-child:hover {
    background-color: #1c5170;
    border-radius: 0px;
  }
  /* ************************************************** */
  .navbar-nav > .active > a:hover {
    background-color: #1c5170 !important;
  }
  .navbar-nav > li > a {
    color: white;
  }

  /*allows nav box to use 100% width*/
  .navbar-collapse,
  nav.container-fluid {
    padding: 0 0px 0 0px;
    flex-direction: column;
  }

  .navbar-collapse .navbar-nav > li:first-child:hover {
    border-radius: 20px 0 0 0;
  }

  .navbar-collapse .panel-collapse .navbar-nav > li:first-child:hover {
    border-radius: 0;
  }

  .navbar-collapse .panel-collapse {
    margin-right: 4px;
  }

  .navbar-collapse .panel-collapse .navbar-nav > li {
    margin-top: 2px;
  }

  .navbar-collapse .panel-collapse .navbar-nav > li:first-child {
    margin-top: 4px;
  }

  .navbar-collapse .panel {
    box-shadow: none;
  }

  .navbar-collapse .panel-group {
    margin-bottom: 10px;
  }

  .navbar-collapse .panel-group .panel + .panel {
    margin-top: 0;
  }

  /*give sidebar 100% width;*/
  li {
    width: 100%;
  }

  @media (min-width: 1330px) {
    /*Show all nav*/
    float: left;
  }
`;

export default ResearchOutputsNavBar;
