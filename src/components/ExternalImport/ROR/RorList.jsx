import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRor } from "../../../services/RorApi";
import Select from "react-select";
import CustomSpinner from "../../Shared/CustomSpinner";
import CustomError from "../../Shared/CustomError";
import { GlobalContext } from "../../context/Global";
import Pagination from "../Pagination";

function RorList() {
  const { t } = useTranslation();
  const { temp, setTemp } = useContext(GlobalContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentData, setcurrentData] = useState([]);
  const [allInitialData, setallInitialData] = useState([]);
  const [contries, setContries] = useState([]);
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
    getRor()
      .then((res) => {
        setData(res.data);
        setallInitialData(res.data);
        const options = res.data.map((option) => ({
          value: option.country.code,
          label: option.country.name,
          object: option,
        }));
        // get distinct array of objects
        let distinctArr = Object.values(
          options.reduce((acc, cur) => {
            if (!acc[cur.value]) acc[cur.value] = cur;
            return acc;
          }, {})
        );
        setContries(distinctArr);
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
    setSelectedKey(selectedKey === el.ror ? null : el.ror);
    const obj = { affiliationId: el.ror, affiliationName: el.name[Object.keys(el.name)[0]], affiliationIdType: "ROR ID" };
    setTemp({ ...temp, ...obj });
  };

  /**
   * The handleChangeCounty function filters an array of data based on the selected country code and updates the data state.
   */
  const handleChangeCounty = (e) => {
    if (e === null) {
      // Handle the cleared selection if needed
      // For instance, reset data to its original state
      getData();
      return;
    }
    const filterPays = data.filter((el) => {
      return el.country.code == e.value;
    });
    setData(filterPays);
  };

  /**
   * The handleChangeText function filters data based on a text input value and updates the state with the filtered results.
   */
  const handleChangeText = (e) => {
    const text = e.target.value;
    setText(text);
    const filteredData = allInitialData.filter((el) => {
      return (
        el.name[Object.keys(el.name)[0]].toLowerCase().includes(text.toLowerCase()) ||
        el.acronyms?.[0]?.toLowerCase()?.includes(text.toLowerCase()) ||
        false
      );
    });
    setData(filteredData);
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
                      placeholder={t("recherche <nom de l'organisation> ou <acronyme>")}
                      onChange={(e) => handleChangeText(e)}
                      style={{ borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)", height: "43px" }}
                    />
                    <span className="input-group-btn">
                      <button
                        className="btn btn-default"
                        type="button"
                        onClick={handleDeleteText}
                        style={{ borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)", height: "43px" }}
                      >
                        <span className="fa fa-times" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="">
              <div className="row">
                <div>
                  <Select
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                      control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)", height: "43px" }),
                    }}
                    onChange={handleChangeCounty}
                    defaultValue={{
                      label: t("Select a country"),
                      value: t("Select a country"),
                    }}
                    options={contries}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
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
                      <input className="text-center" type="checkbox" checked={selectedKey === el.ror} onChange={() => setSelectedValue(el)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row text-center">
            <div className="mx-auto"></div>
            <div className="mx-auto">
              <Pagination items={data} onChangePage={onChangePage} pageSize={8} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default RorList;
