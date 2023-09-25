import React from 'react';
import { parsePattern } from '../../utils/GeneratorUtils';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect';
import { useTranslation } from 'react-i18next';

function ContributorList({
  contributorList,
  handleEdit,
  handleDelete,
  roleOptions,
  defaultRole,
  handleSelectRole,
  parent = 'form',
  templateToString = null,
  tableHeader = null,
  readonly = false
}) {
  const { t } = useTranslation();
  return (
    <>
      {contributorList && (
        <table style={{ marginTop: "20px" }} className="table">
          <thead>
            {contributorList.length > 0 && tableHeader && contributorList.some((el) => el.action !== "delete") && (
              <tr>
                <th scope="col">{tableHeader}</th>
                <th scope="col">{t("Role")}</th>
              </tr>
            )}
          </thead>
          <tbody>
            {contributorList.map((el, idx) => (el.action !== "delete" ?
              <tr key={idx}>
                <td style={{ width: "50%" }}>
                  <div className={styles.border}>
                    <div>{parsePattern(el.person, templateToString || ['$.lastName', ' ', '$.firstName'])} </div>
                    {!readonly && (
                      <div className={styles.table_container}>
                        <div className="col-md-1">
                          {parent === 'form' && (
                            <span>
                              <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                                <i className="fa fa-pen-to-square" />
                              </a>
                            </span>
                          )}
                        </div>
                        <div className="col-md-1">
                          <span>
                            <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDelete(e, idx)}>
                              <i className="fa fa-xmark" />
                            </a>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {roleOptions && (
                    <CustomSelect
                      onChange={(e) => handleSelectRole(e, idx)}
                      options={roleOptions}
                      selectedOption={{ label: el.role || defaultRole, value: el.role || defaultRole }}
                      name="role"
                      isDisabled={readonly}
                    />
                  )}
                </td>
              </tr> : null
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default ContributorList;
