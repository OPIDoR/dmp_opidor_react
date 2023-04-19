import React from "react";
import stylesForm from "../assets/css/form.module.css";
import styles from "../assets/css/redactions.module.css";
import Select from "react-select";
import styled from "styled-components";
import { useEffect } from "react";
import { getTypeSearchProduct, postSearchProduct } from "../../services/DmpSearchProduct";
import { useState } from "react";
import { Panel, PanelGroup } from "react-bootstrap";
import { TfiAngleDown } from "react-icons/tfi";
import { TfiAngleUp } from "react-icons/tfi";
import CustumButton from "../Styled/CustumButton";
import { useContext } from "react";
import { GlobalContext } from "../context/Global";

const ProductStyle = styled.div`
  color: #000;
  padding: 0px;
  margin: 4px 0px 4px 230px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  //   border-radius: 8px 8px 8px 8px;
  //   border: solid;
  //   border-color: var(--primary);
  //   border-width: 1px;
  padding: 35px;
`;
function SearchProduct({ planId }) {
  const { setProductData } = useContext(GlobalContext);
  const [data, setData] = useState(null);
  const [abbreviation, setAbbreviation] = useState(null);
  const [title, setTitle] = useState(null);
  const [type, setType] = useState(null);

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

  const handleSelect = (e) => {
    setType(e.value);
  };
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const obj = {
      plan_id: planId,
      abbreviation: abbreviation,
      title: title,
      type: type,
    };
    const objShow = {
      id: new Date().getTime(),
      abbreviation: abbreviation,
    };
    postSearchProduct(objShow).then((res) => {
      setProductData(res.data.plan.research_outputs);
      setAbbreviation("");
      setTitle("");
    });
  };

  return (
    <ProductStyle>
      <PanelGroup accordion id="accordion-example">
        <Panel eventKey="1" style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}>
          <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
            <Panel.Title toggle>
              <div className={styles.question_title}>
                <div className={styles.question_text}>
                  <p className={styles.title}>Produit de recherche</p>
                </div>
                <span>
                  {/* 3 */}
                  {true ? (
                    <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                  ) : (
                    <TfiAngleUp size={35} style={{ minWidth: "35px" }} className={styles.down_icon} />
                  )}
                </span>
              </div>
            </Panel.Title>
          </Panel.Heading>

          <Panel.Body collapsible={true}>
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
                />
                <small className="form-text text-muted">Limité à 20 caractères</small>
              </div>
              <div className="form-group">
                <div className={stylesForm.label_form}>
                  <strong className={stylesForm.dot_label}></strong>
                  <label>Title</label>
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
              <CustumButton title="Ajouter" position="start" type={"primary"} handleClick={handleSave}></CustumButton>
            </div>
          </Panel.Body>
        </Panel>
      </PanelGroup>
    </ProductStyle>
  );
}

export default SearchProduct;
