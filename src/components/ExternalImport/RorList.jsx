import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { FaLink } from 'react-icons/fa6';
import { FaCheckCircle, FaPlusSquare } from 'react-icons/fa';
import { externalServices } from '../../services';
import CustomSpinner from '../Shared/CustomSpinner';
import CustomError from '../Shared/CustomError';
import Pagination from '../Shared/Pagination';

function RorList({ fragment, setFragment, mapping = {} }) {
  const { t } = useTranslation();
  const pageSize = 8;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [text, setText] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  /**
   * The function `getData` makes an API call to get data, sets the retrieved data in state variables, and creates an array of distinct countries from the
   * data.
   */
  const getData = async (query, filter) => {
    setLoading(true);

    let response;
    try {
      response = await externalServices.getRor(query, filter);
    } catch (error) {
      setError(error);
      return setLoading(false);
    }

    setData(response.data);
    setFilteredData(response.data);

    if (response.data.length === 0) { setCurrentData([]); }

    const options = response.data.map((option) => ({
      value: option.country.code,
      label: option.country.name,
      object: option,
    }));

    // get distinct array of objects
    const distinctCountries = Object.values(
      options.reduce((acc, cur) => {
        if (!acc[cur.value]) acc[cur.value] = cur;
        return acc;
      }, {}),
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
    let obj = {
      affiliationId: el.ror,
      affiliationName: el.name[Object.keys(el.name)[0]],
      affiliationIdType: 'ROR ID',
      acronyms: el.acronyms?.[0],
    };

    if (mapping && Object.keys(mapping)?.length > 0) {
      obj = Object.entries(obj).reduce((acc, [key, value]) => {
        const objKey = mapping?.[key] || key;
        if (!(objKey in mapping)) {
          acc[objKey] = value;
        }
        return acc;
      }, {});
    }

    setFragment({ ...fragment, ...obj });
  };

  /**
   * The handleChangeCounty function filters an array of data based on the selected country code and updates the data state.
   */
  const handleChangeCountry = async (e) => {
    setSelectedCountry(e?.value);

    let response;
    try {
      response = await externalServices.getRor(text, `country.country_code:${e.value}`);
    } catch (error) {
      setError(error);
      return setLoading(false);
    }

    setFilteredData(response.data);
  };

  /**
   * The handleSearchTerm function filters data based on a text input value and updates the state with the filtered results.
   */
  const handleSearchTerm = () => getData(text, selectedCountry ? `country.country_code:${selectedCountry}` : null);

  /**
   * The handleKeyDown function fetch the data when the user uses the Enter button in the search field.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      return getData(text, selectedCountry ? `country.country_code:${selectedCountry}` : null);
    }
    return null;
  };

  /**
   * The function `handleDeleteText` clears the text and then retrieves data.
   */
  const handleDeleteText = () => {
    setText('');
    setData([]);
    setCurrentData([]);
    setSelectedCountry(null);
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
                      placeholder={t('Search for <organization name> or <acronym>')}
                      style={{
                        borderRadius: '8px 0 0 8px', borderWidth: '1px', borderColor: 'var(--dark-blue)', height: '43px',
                      }}
                    />
                    <span className="input-group-btn">
                      <button
                        className="btn btn-default"
                        type="button"
                        onClick={handleSearchTerm}
                        style={{
                          borderRadius: '0', borderWidth: '1px', borderColor: 'var(--dark-blue)', height: '43px', margin: '0',
                        }}
                      >
                        <span className="fas fa-magnifying-glass" style={{ color: 'var(--dark-blue)' }} />
                      </button>
                    </span>
                    <span className="input-group-btn">
                      <button
                        className="btn btn-default"
                        type="button"
                        onClick={handleDeleteText}
                        style={{
                          borderRadius: '0 8px 8px 0', borderWidth: '1px', borderColor: 'var(--dark-blue)', height: '43px', margin: '0',
                        }}
                      >
                        <span className="fa fa-xmark" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {data.length > 0 && countries.length > 1 && (
            <div className="row" style={{ margin: '10px' }}>
              <div className="">
                <div className="row">
                  <div>
                    <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        singleValue: (base) => ({ ...base, color: 'var(--dark-blue)' }),
                        control: (base) => ({
                          ...base, borderRadius: '8px', borderWidth: '1px', borderColor: 'var(--dark-blue)', height: '43px',
                        }),
                      }}
                      onChange={handleChangeCountry}
                      defaultValue={{
                        label: t('Select a country'),
                        value: t('Select a country'),
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
                <th scope="col" />
                <th scope="col">{t('Organization name')}</th>
                <th scope="col">{t('Acronym')}</th>
                <th scope="col">{t('Country')}</th>
                <th scope="col">{t('Location')}</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((el, idx) => (
                <tr key={idx}>
                  <td>
                    {selectedOrg === el.ror
                      ? (
                        <FaCheckCircle
                          className="text-center"
                          style={{ color: 'green' }}
                        />
                      )
                      : (
                        <FaPlusSquare
                          className="text-center"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedValue(el)}
                        />
                      )}
                  </td>
                  <td>
                    {el.name[Object.keys(el.name)[0]]}
&nbsp;
                    <a href={el.links[0]} target="_blank" rel="noopener noreferrer">
                      <FaLink />
                    </a>
                  </td>
                  <td>{el.acronyms}</td>
                  <td>{el.country.code}</td>
                  <td>
                    {Object.values(el.addresses[0])
                      .filter((value) => value)
                      .join(', ')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: loading ? 'center' : 'left' }}>
                    { loading ? <CustomSpinner /> : t('No data available') }
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {data.length > 0 && (
            <div className="row text-center">
              <div className="mx-auto" />
              <div className="mx-auto">
                <Pagination items={filteredData} onChangePage={onChangePage} pageSize={pageSize} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RorList;
