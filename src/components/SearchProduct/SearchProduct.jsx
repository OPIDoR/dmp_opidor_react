import React from "react";
import stylesForm from "../assets/css/form.module.css";
import Select from "react-select";
import { useEffect } from "react";
import { getTypeSearchProduct, postSearchProduct } from "../../services/DmpSearchProduct";
import { useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import { Modal, Button } from "react-bootstrap";

function SearchProduct({ planId, handleClose, show }) {
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
      const lng = "fr";
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
    const obj = {
      plan_id: planId,
      abbreviation: abbreviation,
      title: title,
      type: type,
      hasPersonalData: isPersonnel,
    };

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
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Produit de recherche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ margin: "25px" }}>
          <div className="form-group">
            <div className={stylesForm.label_form}>
              <strong className={stylesForm.dot_label}></strong>
              <label>Abbreviation</label>
            </div>
            <input
              value={abbreviation}
              className={`form-control ${stylesForm.input_text}`}
              placeholder={"ajouter abbreviation"}
              type="text"
              onChange={(e) => setAbbreviation(e.target.value)}
              maxlength="20"
            />
            <small className="form-text text-muted">Limité à 20 caractères</small>
          </div>
          <div className="form-group">
            <div className={stylesForm.label_form}>
              <strong className={stylesForm.dot_label}></strong>
              <label>Titre</label>
            </div>
            <input
              value={title}
              className={`form-control ${stylesForm.input_text}`}
              placeholder={"ajouter titre"}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className={stylesForm.label_form}>
              <strong className={stylesForm.dot_label}></strong>
              <label>Type</label>
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
              <label>Votre produit de rechercher contient-il des données personnelles ?</label>
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
                  Oui
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  onClick={() => setisPersonnel(false)}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Non
                </label>
              </div>
            </div>
          </div>

          {/* <CustomButton title="Ajouter" position="start" type={"primary"} handleClick={handleSave}></CustomButton> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Ajouter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SearchProduct;
