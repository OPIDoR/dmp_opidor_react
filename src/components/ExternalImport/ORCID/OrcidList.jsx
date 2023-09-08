import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOrcid } from "../../../services/ImportServicesApi";
import { GlobalContext } from "../../context/Global";
import CustomError from "../../Shared/CustomError";
import CustomSpinner from "../../Shared/CustomSpinner";
import Pagination from "../Pagination";

function OrcidList() {
  const { t } = useTranslation();
  const pageSize = 8;
  const { subData, setSubData } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [text, setText] = useState("");

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, it is used to fetch data by calling the `getData`
function when the component is mounted for the first time (empty dependency array `[]`). This ensures that the data is fetched only once when the
component is initially rendered. */
  useEffect(() => {
    getData('*');
  }, []);

  /**
   * The function `getData` makes an API call to get data, sets the retrieved data in state variables, and creates an array of distinct countries from the
   * data.
   */
  const getData = (search) => {
    setLoading(true);
    getOrcid(search)
      .then((res) => {
        setData(res.data);
        if(search === '*') { setInitialData(res.data); }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  /**
   * The onChangePage function updates the state with a new page of items.
   */
  const onChangePage = (pageOfItems) => {
    // update state with new page of items
    setCurrentData(pageOfItems);
  };

  /**
   * The function `setSelectedValue` updates the selected key and sets a temporary object with affiliation information.
   */
  const setSelectedValue = (el) => {
    setSelectedPerson(selectedPerson === el.orcid ? null : el.orcid);
    const obj = { firstName: el.givenNames, lastName: el?.familyNames, personId: el.orcid, nameType: t("Personne"), idType: "ORCID iD" };
    setSubData({ ...subData, ...obj });
  };

  /**
   * The handleChangeText function filters data based on a text input value and updates the state with the filtered results.
   */
  const handleSearchTerm = (e) => {
    getData(text);
  };

  /**
   * The handleKeyDown function fetch the data when the user uses the Enter button in the search field.
   */
  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      getData(text);
    }
  }

  /**
   * The function `handleDeleteText` clears the text and then retrieves data.
   */
  const handleDeleteText = () => {
    setText("");
    setData(initialData);
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && <CustomSpinner></CustomSpinner>}
      { error && <CustomError></CustomError>}
      { !error && (
        <>
          <div className="row" style={{ margin: "10px" }}>
            <div>
              <div className="row">
                <div>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={text}
                      placeholder={t("search by <last name> <first name>")}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e)}
                      style={{ borderRadius: "8px 0 0 8px", borderWidth: "1px", borderColor: "var(--primary)", height: "43px" }}
                    />
                    <span className="input-group-btn">
                      <button
                        className="btn btn-default"
                        type="button"
                        onClick={handleSearchTerm}
                        style={{ borderRadius: "0", borderWidth: "1px", borderColor: "var(--primary)", height: "43px", margin: '0' }}
                      >
                        <span className="fas fa-magnifying-glass" style={{ color: "var(--primary)" }}/>
                      </button>
                    </span>
                    <span className="input-group-btn">
                      <button
                        onClick={handleDeleteText}
                        className="btn btn-default"
                        type="button"
                        style={{ borderRadius: "0 8px 8px 0", borderWidth: "1px", borderColor: "var(--primary)", height: "43px", margin: '0' }}
                      >
                        <span className="fa fa-xmark" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  {/* <th scope="col">{t("ID")}</th> */}
                  <th scope="col">{t("Last / First name")}</th>
                  <th scope="col">{t("Establishment")}</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((el, idx) => (
                  <tr key={idx}>
                    {/* <td scope="row">{el.orcid}</td> */}
                    <td>{`${el.familyNames} ${el.givenNames} `}</td>
                    <td>
                      {el?.institutionName.join(' / ')}
                    </td>
                    <td>
                      <input className="text-center" type="checkbox" checked={selectedPerson === el.orcid} onChange={() => setSelectedValue(el)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row text-center">
            <div className="mx-auto"></div>
            <div className="mx-auto">
              <Pagination items={data} onChangePage={onChangePage} pageSize={pageSize} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrcidList;
