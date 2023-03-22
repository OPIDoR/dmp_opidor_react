import React, { useEffect, useState } from "react";
import Banner from "../Shared/Banner";
import Footer from "../Shared/Footer";
import Header from "../Shared/Header";
import Navbar from "../Shared/Navbar";
import Redaction from "./Redaction";
import { BsBell } from "react-icons/bs";
import { BsBellFill } from "react-icons/bs";
import { BsCircle } from "react-icons/bs";
import { BsCheckCircleFill } from "react-icons/bs";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { getQuestion } from "../../services/DmpRedactionApi";
import CustumSpinner from "../Shared/CustumSpinner";
import styles from "../assets/css/sidebar.module.css";
import styled from "styled-components";
import StyledSidebar from "./StyledSidebar";

function RedactionLayout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [researchId, setResearchId] = useState(null);
  const [planId, setPlanId] = useState(null);

  const [currentItems, setcurrentItems] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  /**
   * When the user clicks on a tab, the function sets the active index to the index of the tab that was clicked, and sets the research id to the id of the
   * tab that was clicked.
   */
  const handleClick = (e, id, index) => {
    e.preventDefault();
    setActiveIndex(index);
    setResearchId(id);
  };

  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  useEffect(() => {
    setLoading(true);
    getQuestion("token")
      .then((res) => {
        const result = res.data.plan.research_outputs;
        setPlanId(res.data.plan.id);
        setResearchId(result[activeIndex].id);
        setData(result);

        // const currentItems = result.slice(indexOfFirstItem, indexOfLastItem);
        // setcurrentItems(currentItems);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (data) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
      setcurrentItems(currentItems);
    }
  }, [currentPage, data]);

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Header></Header>
      <Banner></Banner>
      <Navbar></Navbar>

      {loading && <CustumSpinner></CustumSpinner>}
      {!loading && error && <p>error</p>}
      {!loading && !error && data && (
        <div className={styles.section}>
          <StyledSidebar className="navbar-inverse">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="bs-sidebar-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  {currentItems &&
                    currentItems.map((el, idx) => (
                      <li key={idx} className={activeIndex === idx ? "active" : ""} onClick={(e) => handleClick(e, el.id, idx)}>
                        <a href="#" className={styles.nav_header}>
                          <div className={styles.nav_title}>{el.abbreviation}</div>
                          <div className={styles.nav_icon}>
                            <BsBellFill size={40} className={styles.space_right} style={{ color: "var(--orange)" }}></BsBellFill>
                            <BsCircle size={40}></BsCircle>
                          </div>
                        </a>
                      </li>
                    ))}
                  {data.length > itemsPerPage && (
                    <>
                      {currentPage * itemsPerPage < data.length && ( // Only show the "Next" button if not on the last page
                        <li>
                          <a
                            href="#"
                            className={styles.nav_header}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage + 1);
                            }}
                          >
                            <div className={styles.nav_title}>Suivant</div>
                            <div className={styles.nav_icon}>
                              <BsArrowRight size={40}></BsArrowRight>
                            </div>
                          </a>
                        </li>
                      )}
                      {currentPage > 1 && ( // Only show the "Previous" button if the current page is greater than 1
                        <li>
                          <a
                            href="#"
                            className={styles.nav_header}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePreviousPage();
                            }}
                          >
                            <div className={styles.nav_title}>Précident</div>
                            <div className={styles.nav_icon}>
                              <BsArrowLeft size={40}></BsArrowLeft>
                            </div>
                          </a>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </StyledSidebar>
          <div className={styles.main}>
            <Redaction researchId={researchId} planId={planId}></Redaction>
          </div>
        </div>
      )}
      <Footer></Footer>
    </>
  );
}

export default RedactionLayout;
