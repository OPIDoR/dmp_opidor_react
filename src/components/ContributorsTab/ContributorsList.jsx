import React, { useState } from "react";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useTranslation } from "react-i18next";
import { FaPenToSquare, FaXmark } from "react-icons/fa6";

import { parsePattern } from "../../utils/GeneratorUtils";
import Pagination from "../Shared/Pagination";
import { isValidHttpUrl } from "../../utils/utils";
import * as styles from '../assets/css/form.module.css';

function ContributorsList({ contributors, template, handleEdit, handleDelete, readonly = false }) {
  const { t } = useTranslation();
  const [currentData, setCurrentData] = useState([]);

  /**
   * The onChangePage function updates the state with a new page of items.
   */
  const onChangePage = (pageOfItems) => {
    // update state with new page of items
    setCurrentData(pageOfItems);
  };

  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">{t("Name")}</th>
            <th scope="col" className="sorter-false">{t("Affiliation")}</th>
            <th scope="col" className="sorter-false">{t("Attributed roles (Associated research outputs)")}</th>
            <th scope="col" className="sorter-false">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 && template ? currentData.map((contributor, idx) => (
            <tr key={contributor.id}>
              <td>
                {parsePattern(contributor.data, template?.schema?.to_string)}
                {contributor.data?.personId && (
                  isValidHttpUrl(contributor.data?.personId) ?
                    [' - ', <a key={contributor.id} href={contributor.data?.personId} target="_blank" rel="noreferrer">{contributor.data?.personId}</a>] :
                    ` - ${contributor.data?.personId}`
                )}
              </td>
              <td>
                {contributor.data?.affiliationName}
                {contributor.data?.affiliationId && (
                  isValidHttpUrl(contributor.data?.affiliationId) ?
                    [' - ', <a key={contributor.id} href={contributor.data?.affiliationId} target="_blank" rel="noreferrer">{contributor.data?.affiliationId}</a>] :
                    ` - ${contributor.data?.affiliationId}`
                )}
              </td>
              <td>
                <ul>
                  {contributor.roles.map((role, ridx) => <li key={`${contributor.id}_${ridx}`}>{role}</li>)}
                </ul>
              </td>
              <td>
                {!readonly && (
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
                      size={18}
                      onClick={() => handleEdit(idx)}
                      className={styles.icon}
                    />
                    {contributors.length > 1 &&
                      <>
                        <ReactTooltip
                          id="contributor-delete-button"
                          place="bottom"
                          effect="solid"
                          variant="info"
                          content={t('Delete')}
                        />
                        <FaXmark
                          data-tooltip-id="contributor-delete-button"
                          size={18}
                          onClick={() => handleDelete(idx)}
                          className={styles.icon}
                        />
                      </>
                    }
                  </>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'left' }}>
                {t('No data available')}
              </td>
            </tr>
          )}
        </tbody>
      </table>


      {contributors.length > 0 && (
        <div className="row text-right">
          <div className="mx-auto">
            <Pagination items={contributors} onChangePage={onChangePage} pageSize={10} />
          </div>
        </div>
      )}
    </>
  )
}

export default ContributorsList;
