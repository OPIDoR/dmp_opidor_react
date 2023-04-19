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
import CustomSpinner from "../Shared/CustomSpinner";
import styles from "../assets/css/sidebar.module.css";
import StyledSidebar from "./StyledSidebar";
import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import CustomError from "../Shared/CustomError";
import SearchProduct from "../SearchProduct/SearchProduct";

function RedactionLayout() {
  const { setForm, searchProduct, setproductId, productData, setProductData } = useContext(GlobalContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [data, setData] = useState(null);
  const [researchOutputId, setResearchOutputId] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [currentItems, setcurrentItems] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [renderKey, setRenderKey] = useState(0);

  /**
   * When the user clicks on a page number, the current page number is set to the new page number.
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  /**
   * When the user clicks on a tab, the function sets the active index to the index of the tab that was clicked, and sets the research id to the id of the
   * tab that was clicked.
   */
  const handleShowResearchOutputClick = (e, id, index) => {
    e.preventDefault();
    setRenderKey((prevKey) => prevKey + 1);
    handleIdsUpdate(id, true);
    setActiveIndex(id);
    //setPlanId(id);
  };

  /**
   * This function updates the displayed research output ID, product ID, and form based on the provided ID and whether or not it is null.
   */
  const handleIdsUpdate = (id, isNull) => {
    // exist and not empty
    if (searchProduct && searchProduct[id] && Object.keys(searchProduct[id]).length > 0) {
      setForm(searchProduct[id]);
    } else {
      isNull && setForm(null);
    }
    setResearchOutputId(id);
    setproductId(id);
  };

  /* A hook that is called when the component is mounted. It is used to fetch data from the API. */
  //TODO update this , it can make error
  useEffect(() => {
    setActiveIndex(0);
    setLoading(true);
    getQuestion("token")
      .then((res) => {
        const result = res.data.plan.research_outputs;
        const resultId = result[0].id;
        setActiveIndex(result[0].id);
        setPlanId(res.data.plan.id);
        !productData && setProductData(result);
        handleIdsUpdate(resultId, false);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [productData]);

  /* This is a `useEffect` hook that is triggered whenever the `currentPage` or `data` state variables change. It calculates the range of items to be
displayed on the current page based on the `currentPage` and `itemsPerPage` variables, and then sets the `currentItems` state variable to an array of
items within that range, using the `slice` method on the `data` array. This allows the component to display a subset of the data on each page, based
on the current page number. */
  useEffect(() => {
    if (productData) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);
      setcurrentItems(currentItems);
    }
  }, [currentPage, productData]);

  /**
   * The function handles going to the previous page by decreasing the current page number.
   */
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Header></Header>
      <Banner></Banner>
      <Navbar></Navbar>
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError></CustomError>}
      {!loading && !error && productData && (
        <>
          <SearchProduct planId={planId}></SearchProduct>

          <div className={styles.section}>
            <StyledSidebar className="navbar-inverse">
              <div className="container-fluid">
                <div className="collapse navbar-collapse" id="bs-sidebar-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    {productData.length > itemsPerPage && (
                      <>
                        {currentPage * itemsPerPage < productData.length && ( // Only show the "Next" button if not on the last page
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
                      </>
                    )}
                    {currentItems &&
                      currentItems.map((el, idx) => (
                        <li key={idx} className={activeIndex == el.id ? "active" : ""} onClick={(e) => handleShowResearchOutputClick(e, el.id, idx)}>
                          <a href="#" className={styles.nav_header}>
                            <div className={styles.nav_title}>{el.abbreviation}</div>
                            <div className={styles.nav_icon}>
                              <BsBell size={40} className={styles.space_right} style={{ color: "var(--orange)" }}></BsBell>
                              <BsCheckCircleFill size={40} className={styles.space_right} style={{ color: "var(--orange)" }}></BsCheckCircleFill>
                            </div>
                          </a>
                        </li>
                      ))}
                    {productData.length > itemsPerPage && (
                      <>
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
              <Redaction key={renderKey} researchOutputId={researchOutputId} planId={planId}></Redaction>
            </div>
          </div>
        </>
      )}
      <Footer></Footer>
    </>
  );
}

export default RedactionLayout;
