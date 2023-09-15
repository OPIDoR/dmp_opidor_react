import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { externalServices } from "../../../services";
import Select from "react-select";
import CustomSpinner from "../../Shared/CustomSpinner";
import CustomError from "../../Shared/CustomError";
import { GlobalContext } from "../../context/Global";
import Pagination from "../Pagination";

function RorList() {
  const { t } = useTranslation();
  const pageSize = 8;
  const { subData, setSubData } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [text, setText] = useState("");

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, it is used to fetch data by calling the `getData`
function when the component is mounted for the first time (empty dependency array `[]`). This ensures that the data is fetched only once when the
component is initially rendered. */
  useEffect(() => {
    getData('*', '');
  }, []);

  /**
   * The function `getData` makes an API call to get data, sets the retrieved data in state variables, and creates an array of distinct countries from the
   * data.
   */
  const getData = async (query, filter) => {
    setLoading(true);

    let response;
    try {
      response = await services.getRor(query, filter);
    } catch (error) {
      setError(error);
      return setLoading(false);
    }

    setData(response.data);

    if(query === '*') { setInitialData(response.data); }

    const options = response.data.map((option) => ({
      value: option.country.code,
      label: option.country.name,
      object: option,
    }));

    // get distinct array of objects
    let distinctCountries = Object.values(
      options.reduce((acc, cur) => {
        if (!acc[cur.value]) acc[cur.value] = cur;
        return acc;
      }, {})
    );
    setCountries(distinctCountries);

    setLoading(false);
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
    setSelectedOrg(selectedOrg === el.ror ? null : el.ror);
    const obj = { affiliationId: el.ror, affiliationName: el.name[Object.keys(el.name)[0]], affiliationIdType: "ROR ID" };
    setSubData({ ...subData, ...obj });
  };

  /**
   * The handleChangeCounty function filters an array of data based on the selected country code and updates the data state.
   */
  const handleChangeCountry = (e) => {
    const filteredByCountry = initialData.filter((el) => {
      return el.country.code === e.value;
    });
    setData(filteredByCountry);
  };

  /**
   * The handleSearchTerm function filters data based on a text input value and updates the state with the filtered results.
   */
  const handleSearchTerm = () => {
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
      { loading &&  <CustomSpinner></CustomSpinner>}
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
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e)}
                      placeholder={t("search for <organization name> or <acronym>")}
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
                        className="btn btn-default"
                        type="button"
                        onClick={handleDeleteText}
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
          {countries.length > 1 && (
            <div className="row" style={{ margin: "10px" }}>
              <div className="">
                <div className="row">
                  <div>
                    <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                        control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)", height: "43px" }),
                      }}
                      onChange={handleChangeCountry}
                      defaultValue={{
                        label: t("Select a country"),
                        value: t("Select a country"),
                      }}
                      options={countries}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">{t("Organization name")}</th>
                <th scope="col">{t("Acronym")}</th>
                <th scope="col">{t("Country")}</th>
                <th scope="col">{t("Location")}</th>
                {/* <th scope="col">ROR</th> */}
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((el, idx) => (
                <tr key={idx}>
                  <td scope="row">
                    <a href={el.links[0]} target="_blank" rel="noopener noreferrer">
                      {el.name[Object.keys(el.name)[0]]}
                    </a>
                  </td>
                  <td>{el.acronyms}</td>
                  <td>{el.country.code}</td>
                  <td scope="row">
                    {Object.values(el.addresses[0])
                      .filter((value) => value)
                      .join(", ")}
                  </td>
                  {/* <td>{el.ror}</td> */}
                  <td>
                    <input className="text-center" type="checkbox" checked={selectedOrg === el.ror} onChange={() => setSelectedValue(el)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

export default RorList;
