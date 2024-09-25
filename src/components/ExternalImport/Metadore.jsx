import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import get from 'lodash.get';
import set from 'lodash.set';
import { FaCheckCircle, FaPlusSquare } from "react-icons/fa";
import axios from "axios";

import { externalServices } from "../../services";
import CustomSpinner from "../Shared/CustomSpinner";
import CustomError from "../Shared/CustomError";
import Pagination from "../Shared/Pagination";
import { flattenObject } from "../../utils/utils";
import { service } from "../../services";

function Metadore({ fragment, setFragment, mapping = {} }) {
  const { t } = useTranslation();
  const pageSize = 8;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [text, setText] = useState('');
  const [registry, setRegistry] = useState(null);

  useEffect(() => {
    service.getRegistryByName('DataLicenses').then(({ data }) => setRegistry(data));
  }, []);

  /**
   * The function `getData` makes an API call to get data, sets the retrieved data in state variables, and creates an array of distinct countries from the
   * data.
   */
  const getData = async (query) => {
    setLoading(true);

    let response;
    try {
      response = await externalServices.getMetadore(query);
    } catch (error) {
      setError(error);
      return setLoading(false);
    }

    const { data: resData } = response.data;

    setData(resData);

    if (resData.length === 0) { setCurrentData([]); }

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
  const setSelectedValue = async (el) => {
    setSelectedData(selectedData === el.id ? null : el.id);

    let obj = {
      title: el?.attributes?.titles?.at(0)?.title,
      description:  el?.attributes?.descriptions?.at(0)?.description,
      versionNumber: el?.attributes?.version,
      license: {
        licenseName: el?.attributes?.rightsList?.at(0)?.rights,
        licenseUrl: el?.attributes?.rightsList?.at(0)?.rightsUri,
      },
      idType: 'DOI',
      datasetId: el?.id,
    };
    const matchData = data.find(({ id }) => id.toLowerCase() === el.id.toLowerCase());

    if (matchData) {
      const flattenedMapping = flattenObject(mapping);

      for (const [key, value] of Object.entries(flattenedMapping)) {
        set(obj, key, get(matchData, value));
      }
    }

    if (obj?.datasetId) {
      set(obj, 'datasetId', `https://doi.org/${el?.id}`);
    }

    if (obj?.license.licenseName) {
      if (registry) {
        const { licenseName, licenseUrl } = registry?.find(({ licenseName }) => licenseName.toLowerCase() === obj?.license.licenseName .toLowerCase());
        if (licenseName) {
          set(obj, 'license', { licenseName, licenseUrl });
        }
      }
    }

    if (!obj?.license.licenseName && !obj?.license.licenseUrl) {
      set(obj, 'license', null);
    }

    setFragment({ ...fragment, ...obj });
  };

  /**
   * The handleSearchTerm function filters data based on a text input value and updates the state with the filtered results.
   */
  const handleSearchTerm = () => getData(text);

  /**
   * The handleKeyDown function fetch the data when the user uses the Enter button in the search field.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      return getData(text);
    }
    return null;
  }

  /**
   * The function `handleDeleteText` clears the text and then retrieves data.
   */
  const handleDeleteText = () => {
    setText('');
    setData([]);
    setCurrentData([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      {error && <CustomError />}
      {!error && (
        <>
          <div className="row" style={{ margin: '10px' }}>
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
                      placeholder={t('Search by <DOI (e.g. 10.5281/zenodo.13826305)> or <Title>')}
                      style={{ borderRadius: '8px 0 0 8px', borderWidth: '1px', borderColor: 'var(--dark-blue)', height: '43px' }}
                    />
                    <span className="input-group-btn">
                      <button
                        className="btn btn-default"
                        type="button"
                        onClick={handleSearchTerm}
                        style={{ borderRadius: '0', borderWidth: '1px', borderColor: 'var(--dark-blue)', height: '43px', margin: '0' }}
                      >
                        <span className="fas fa-magnifying-glass" style={{ color: "var(--dark-blue)" }} />
                      </button>
                    </span>
                    <span className="input-group-btn">
                      <button
                        className="btn btn-default"
                        type="button"
                        onClick={handleDeleteText}
                        style={{ borderRadius: '0 8px 8px 0', borderWidth: '1px', borderColor: 'var(--dark-blue)', height: '43px', margin: '0' }}
                      >
                        <span className="fa fa-xmark" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col"></th>
                <th scope="col">{t('DOI')}</th>
                <th scope="col">{t('Title')}</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((el, idx) => (
                <tr key={idx}>
                  <td>
                    {selectedData === el.id ?
                      <FaCheckCircle
                        className="text-center"
                        style={{ color: 'green' }}
                      /> :
                      <FaPlusSquare
                        className="text-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedValue(el)} />
                    }
                  </td>
                  <td>{el.id}</td>
                  <td>{el.attributes.titles.at(0).title}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: loading ? 'center': 'left' }}>
                    { loading ? <CustomSpinner /> : t('No data available') }
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {data.length > 0 && (
            <div className="row text-center">
              <div className="mx-auto"></div>
              <div className="mx-auto">
                <Pagination items={data} onChangePage={onChangePage} pageSize={pageSize} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Metadore;
