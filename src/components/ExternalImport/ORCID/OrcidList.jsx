import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOrcid } from "../../../services/ImportServicesApi";
import { GlobalContext } from "../../context/Global";
import CustomError from "../../Shared/CustomError";
import CustomSpinner from "../../Shared/CustomSpinner";
import Pagination from "../Pagination";

function OrcidList() {
  const { t } = useTranslation();
  const { temp, setTemp } = useContext(GlobalContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentData, setcurrentData] = useState([]);
  const [allInitialData, setallInitialData] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [text, setText] = useState("");

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, it is used to fetch data by calling the `getData`
function when the component is mounted for the first time (empty dependency array `[]`). This ensures that the data is fetched only once when the
component is initially rendered. */
  useEffect(() => {
    getData();
  }, []);

  /**
   * The function `getData` makes an API call to get data, sets the retrieved data in state variables, and creates an array of distinct countries from the
   * data.
   */
  const getData = () => {
    setLoading(true);
    getOrcid()
      .then((res) => {
        setData(res.data);
        setallInitialData(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  /**
   * The onChangePage function updates the state with a new page of items.
   */
  const onChangePage = (pageOfItems) => {
    // update state with new page of items
    setcurrentData(pageOfItems);
  };

  /**
   * The function `setSelectedValue` updates the selected key and sets a temporary object with affiliation information.
   */
  const setSelectedValue = (el) => {
    setSelectedKey(selectedKey === el.orcid ? null : el.orcid);
    const obj = { firstName: el.givenNames, lastName: el?.familyNames, personId: el.orcid, nameType: "Personne", idType: "ORCID iD" };
    setTemp({ ...temp, ...obj });
  };

  /**
   * The handleChangeText function filters data based on a text input value and updates the state with the filtered results.
   */
  const handleChangeText = (e) => {
    const text = e.target.value;
    setText(text);
    const filterText = allInitialData.filter((el) => {
      return el.familyNames.toLowerCase().includes(text.toLowerCase()) || el.givenNames.toLowerCase().includes(text.toLowerCase());
    });
    setData(filterText);
  };

  /**
   * The function `handleDeleteText` clears the text and then retrieves data.
   */
  const handleDeleteText = () => {
    setText("");
    getData();
  };

  return (
    <>
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError></CustomError>}
      {!loading && !error && data && (
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
                      onChange={(e) => handleChangeText(e)}
                      style={{ borderRadius: "8px 0 0 8px", borderWidth: "1px", borderColor: "var(--primary)", height: "43px" }}
                    />
                    <span className="input-group-btn">
                      <button
                        onClick={handleDeleteText}
                        className="btn btn-default"
                        type="button"
                        style={{ borderRadius: "0 8px 8px 0", borderWidth: "1px", borderColor: "var(--primary)", height: "43px" }}
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
                    <td scope="row">
                      {el?.institutionName.map((e, idx) => (
                        <React.Fragment key={idx}>{e}</React.Fragment>
                      ))}
                    </td>
                    <td>
                      <input className="text-center" type="checkbox" checked={selectedKey === el.orcid} onChange={() => setSelectedValue(el)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row text-center">
            <div className="mx-auto"></div>
            <div className="mx-auto">
              <Pagination items={data} onChangePage={onChangePage} pageSize={5} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OrcidList;
