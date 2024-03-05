import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaPenToSquare, FaXmark } from 'react-icons/fa6';

import { parsePattern } from '../../utils/GeneratorUtils';
import styles from '../assets/css/form.module.css';
import CustomSelect from '../Shared/CustomSelect';


function PersonsList({
  personsList,
  handleEdit,
  handleDelete,
  roleOptions,
  defaultRole,
  handleSelectRole,
  parent = 'form',
  templateToString = [],
  tableHeader = null,
  overridable = false,
  readonly = false
}) {
  const { t } = useTranslation();
  return (
    <>
      {personsList && (
        <table style={{ marginTop: "20px" }} className="table">
          <thead>
            {personsList.length > 0 && tableHeader && personsList.some((el) => el.action !== "delete") && (
              <tr>
                <th scope="col">{tableHeader}</th>
                <th scope="col">{t("Role")}</th>
              </tr>
            )}
          </thead>
          <tbody>
            {personsList.map((el, idx) => (el.action !== "delete" ?
              <tr key={idx}>
                <td style={{ width: "50%" }}>
                  <div className={styles.cell_content}>
                    <div>{parsePattern(el.person, templateToString.length > 0 ? templateToString : ['$.lastName', ' ', '$.firstName'])} </div>
                    {!readonly && (
                      <div className={styles.table_container}>
                        {parent === 'form' && (
                          <>
                            <ReactTooltip
                              id="contributor-edit-button"
                              place="bottom"
                              effect="solid"
                              variant="info"
                              content={t('Edit')}
                            />
                            <FaPenToSquare
                              data-tooltip-id="contributor-edit-button"
                              onClick={(e) => handleEdit(e, idx)}
                              className={styles.icon}
                            />
                          </>
                        )}
                        <ReactTooltip
                          id="contributor-delete-button"
                          place="bottom"
                          effect="solid"
                          variant="info"
                          content={t('Delete')}
                        />
                        <FaXmark
                          data-tooltip-id="contributor-delete-button"
                          onClick={(e) => handleDelete(e, idx)}
                          className={styles.icon}
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {roleOptions && (
                    <CustomSelect
                      onSelectChange={(e) => handleSelectRole(e, idx)}
                      options={roleOptions}
                      selectedOption={{ label: el.role || defaultRole, value: el.role || defaultRole }}
                      name="role"
                      isDisabled={readonly}
                      overridable={overridable}
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

export default PersonsList;
