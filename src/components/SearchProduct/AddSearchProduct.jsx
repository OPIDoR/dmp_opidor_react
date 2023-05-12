import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import stylesForm from "../assets/css/form.module.css";
import { GlobalContext } from "../context/Global";
import Select from "react-select";
import { getTypeSearchProduct, postSearchProduct } from "../../services/DmpSearchProduct";
import styled from "styled-components";

const EndButton = styled.div`
  display: flex;
  justify-content: end;
`;

function AddSearchProduct({ planId, handleClose, show }) {
  const { lng } = useContext(GlobalContext);
  const { t } = useTranslation();
  const { setProductData } = useContext(GlobalContext);
  const [data, setData] = useState(null);
  const [abbreviation, setAbbreviation] = useState(null);
  const [title, setTitle] = useState(null);
  const [type, setType] = useState(null);
  const [isPersonnel, setisPersonnel] = useState(true);

  /* This is a `useEffect` hook that is used to fetch data from the server using the `getTypeSearchProduct` function. It sets the fetched data to the
`data` state variable using the `setData` function. The `[]` as the second argument to the `useEffect` hook means that this effect will only run once
when the component mounts. */
  useEffect(() => {
    getTypeSearchProduct().then((res) => {
      const options = res.data.map((option) => ({
        value: lng === "fr" ? option?.fr_FR || option?.label?.fr_FR : option?.en_GB || option?.label?.en_GB,
        label: lng === "fr" ? option?.fr_FR || option?.label?.fr_FR : option?.en_GB || option?.label?.en_GB,
      }));
      setData(options);
    });
  }, []);

  /**
   * This is a function that handles the selection of a value and sets it as the type.
   */
  const handleSelect = (e) => {
    setType(e.value);
  };
  /**
   * The function handles saving data by creating an object and posting it to a server, then updating state variables and closing a modal.
   */
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // const obj = {
    //   plan_id: planId,
    //   abbreviation: abbreviation,
    //   title: title,
    //   type: type,
    //   hasPersonalData: isPersonnel,
    // };
    const objShow = {
      id: new Date().getTime(),
      abbreviation: abbreviation,
      metadata: {
        hasPersonalData: isPersonnel,
        abbreviation: abbreviation,
      },
    };
    postSearchProduct(objShow).then((res) => {
      setProductData(res.data.plan.research_outputs);
      setAbbreviation("");
      setTitle("");
      handleClose();
    });
  };

  return (
    <div style={{ margin: "25px" }}>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Abbreviation")}</label>
        </div>
        <input
          value={abbreviation}
          className={`form-control ${stylesForm.input_text}`}
          placeholder={t("add abbreviation")}
          type="text"
          onChange={(e) => setAbbreviation(e.target.value)}
          maxLength="20"
        />
        <small className="form-text text-muted">{t("Limited to 20 characters")}</small>
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Title")}</label>
        </div>
        <input
          value={title}
          className={`form-control ${stylesForm.input_text}`}
          placeholder={t("add title")}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <strong className={stylesForm.dot_label}></strong>
          <label>{t("Type")}</label>
        </div>
        {data && (
          <Select
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }) }}
            options={data}
            style={{ color: "red" }}
            onChange={handleSelect}
          />
        )}
      </div>
      <div className="form-group">
        <div className={stylesForm.label_form}>
          <label>{t("Does your research product contain personal data?")}</label>
        </div>
        <div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onClick={() => setisPersonnel(true)}
              defaultChecked
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              {t("Yes")}
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setisPersonnel(false)} />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              {t("No")}
            </label>
          </div>
        </div>
      </div>
      <EndButton>
        <Button variant="secondary" onClick={handleClose} style={{ marginRight: "8px" }}>
          {t("Close")}
        </Button>
        <Button variant="outline-primary" onClick={handleSave} style={{ backgroundColor: "var(--orange)", color: "white" }}>
          {t("Add")}
        </Button>
      </EndButton>
    </div>
  );
}

export default AddSearchProduct;
