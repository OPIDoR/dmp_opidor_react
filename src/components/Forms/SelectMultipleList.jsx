import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { GlobalContext } from "../context/Global";
import Swal from "sweetalert2";
import { getRegistry, getRegistryValue } from "../../services/DmpServiceApi";
import styles from "../assets/css/form.module.css";
import { useTranslation } from "react-i18next";

/* This is a functional React component called `SelectMultipleList` that renders a select list with the ability to add and remove items from a list. It
receives several props such as `label`, `registry`, `name`, `changeValue`, `tooltip`, `header`, and `schemaId`. It uses the `useState` and `useEffect`
hooks to manage the state of the component and to fetch data from an API. It also uses the `Swal` library to display a confirmation message when
deleting an item from the list. */

function SelectMultipleList({ label, registry, name, changeValue, tooltip, header, keyValue, schemaId }) {
  const { t } = useTranslation();
  const [list, setlist] = useState([]);
  const [options, setoptions] = useState(null);
  const { form, temp, setTemp, lng } = useContext(GlobalContext);

  /* A hook that is called when the component is mounted. It is used to set the options of the select list. */
  useEffect(() => {
    let isMounted = true;
    const createOptions = (data) => {
      return data.map((option) => ({
        value: lng === "fr" ? option?.fr_FR || option?.label?.fr_FR : option?.en_GB || option?.label?.en_GB,
        label: lng === "fr" ? option?.fr_FR || option?.label?.fr_FR : option?.en_GB || option?.label?.en_GB,
        object: option,
      }));
    };
    const setOptions = (data) => {
      if (isMounted) {
        setoptions(data);
      }
    };
    getRegistryValue(registry, "token")
      .then((res) => {
        if (res) {
          setOptions(createOptions(res));
        } else {
          return getRegistry(registry, "token").then((resRegistry) => {
            setOptions(createOptions(resRegistry));
          });
        }
      })
      .catch((error) => {
        // handle errors
      });
    return () => {
      isMounted = false;
    };
  }, [registry, lng]);

  /**
   * It takes the value of the input field and adds it to the list array.
   * @param e - the event object
   */
  const handleChangeList = (e) => {
    const copieList = [...(list || []), e.value];
    changeValue({ target: { name: name, value: [...copieList] } });
    setlist(copieList);
  };

  /* A hook that is called when the component is mounted. It is used to set the options of the select list. */
  useEffect(() => {
    if (temp) {
      setlist(temp[name]);
    } else {
      setlist(form?.[schemaId]?.[keyValue]);
    }
  }, [temp]);

  /**
   * This function handles the deletion of an element from a list and displays a confirmation message using the Swal library.
   */
  const handleDeleteListe = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: t("Etes-vous sûr ?"),
      text: t("Voulez-vous vraiment supprimer cet élément ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Annuler"),
      confirmButtonText: t("Oui, supprimer !"),
    }).then((result) => {
      if (result.isConfirmed) {
        const newList = [...list];
        // only splice array when item is found
        if (idx > -1) {
          newList.splice(idx, 1); // 2nd parameter means remove one item only
        }
        setlist(newList);
        setTemp({ ...temp, [name]: newList });
        Swal.fire(t("Supprimé!"), t("Opération effectuée avec succès!."), "success");
      }
    });
  };

  return (
    <>
      <div className="form-group">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label>{label}</label>
          {tooltip && (
            <span className="m-4" data-toggle="tooltip" data-placement="top" title={tooltip}>
              ?
            </span>
          )}
        </div>
        <div className={styles.input_label}>{t("Sélectionnez une valeur de la liste")}.</div>
        <div className="row">
          <div className={`col-md-12 ${styles.select_wrapper}`}>
            <Select
              onChange={handleChangeList}
              options={options}
              name={name}
              defaultValue={{
                label: temp ? temp[name] : "",
                value: temp ? temp[name] : "",
              }}
            />
          </div>
        </div>
        <div style={{ margin: "20px 2px 20px 2px" }}>
          {header && <p>{header}</p>}
          {list &&
            list.map((el, idx) => (
              <div key={idx} className="row border">
                <div className="col-md-11">
                  <p className={`m2 ${styles.border}`}> {el} </p>
                </div>
                <div className="col-md-1" style={{ marginTop: "8px" }}>
                  <span>
                    <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteListe(e, idx)}>
                      <i className="fa fa-times" />
                    </a>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default SelectMultipleList;
