import styled from "styled-components";

const StyledNavBar = styled.nav`
  background-color: #80b1cd;
  width: 220px;
  height: 100%;
  margin-left: -160px;
  float: left;
  z-index: 8000;
  margin-bottom: 0px;
  border-radius: 0px 0px 0px 0px;
  margin-left: 0px;
  float: left;
  position: sticky;
  top: 0;

  .navbar-nav {
    margin: 0px 0px 0px 0px;
  }

  /*adds border top to first nav box */
  .navbar-nav > li:first-child {
    border-top: 0px #e5e5e5 solid;
  }

  /*adds border to bottom nav boxes*/
  .navbar-nav > li {
    border-bottom: 3px var(--white) solid;
  }

  /* ******************* active ******************************* */
  .navbar-nav > .active:first-child > a {
    background-color: #1c5170 !important;
    border-radius: 0px 0px 0px 0px;
  }

  .navbar-nav > .active:not(:first-child):not(:last-child) > a {
    background-color: #1c5170 !important;
    border-radius: 0px 0px 0px 0px;
  }

  .navbar-nav > .active:not(:first-child) > a {
    background-color: #1c5170 !important;
    border-radius: 0px 0px 0px 20px;
  }
  /* ************************************************** */

  /* *********************** hover *************************** */
  .navbar-nav > li:first-child:hover {
    background-color: #1c5170;
    border-radius: 0px 0px 0px 0px;
  }

  .navbar-nav > li:not(:first-child):not(:last-child):hover {
    background-color: #1c5170;
    border-radius: 0px 0px 0px 0px;
  }

  .navbar-nav > li:last-child:hover {
    background-color: #1c5170;
    border-radius: 0px 0px 0px 0px;
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
  }

  /*give sidebar 100% width;*/
  li {
    width: 100%;
  }

  @media (min-width: 1330px) {
    /*Show all nav*/
    margin-left: 0px;
    float: left;
  }
`;

export default StyledNavBar;
