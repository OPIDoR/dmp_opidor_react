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
  const { t, i18n } = useTranslation();
  const [lng] = useState(i18n.language.split("-")[0]);
  const [list, setlist] = useState([]);
  const [options, setoptions] = useState(null);
  const { form, temp, setTemp } = useContext(GlobalContext);

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
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        const newList = [...list];
        // only splice array when item is found
        if (idx > -1) {
          newList.splice(idx, 1); // 2nd parameter means remove one item only
        }
        setlist(newList);
        setTemp({ ...temp, [name]: newList });
        Swal.fire(t("Deleted!"), t("Operation completed successfully!."), "success");
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
        <div className={styles.input_label}>{t("Select a value from the list")}.</div>
        <div className="row">
          <div className={`col-md-12 ${styles.select_wrapper}`}>
            <Select
              onChange={handleChangeList}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }),
                singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)" }),
              }}
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
          {list && (
            <table style={{ marginTop: "0px" }} className="table">
              <thead> {header && <p>{header}</p>}</thead>
              <tbody>
                {list.map((el, idx) => (
                  <tr key={idx}>
                    <td scope="row" style={{ width: "100%" }}>
                      <div className={styles.border}>
                        <div>{el} </div>
                        <div className={styles.table_container}>
                          <div className="col-md-1">
                            <span style={{ marginRight: "10px" }}>
                              <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteListe(e, idx)}>
                                <i className="fa fa-times" />
                              </a>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default SelectMultipleList;
