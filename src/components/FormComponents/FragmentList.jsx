import React from 'react';
import { FaPenToSquare, FaEye, FaXmark } from 'react-icons/fa6';
import { createMarkup, parsePattern } from '../../utils/GeneratorUtils';

function FragmentList({
  fragmentsList,
  handleEdit,
  handleDelete,
  parent = 'form',
  templateToString = [],
  tableHeader = null,
  readonly = false
}) {
  return (
    <>
      {fragmentsList && (
        <table style={{ marginTop: '20px' }} className="table table-hover">
          {tableHeader && (
            <thead>
              {fragmentsList.length > 0 &&
                fragmentsList.some((el) => el.action !== "delete") && (
                  <tr>
                    <th scope="col">{tableHeader}</th>
                    <th scope="col">Actions</th>
                  </tr>
                )}
            </thead>
          )}
          <tbody>
            {fragmentsList
              .map((el, idx) => (el.action !== 'delete' ?
                <tr key={idx}>
                  <td dangerouslySetInnerHTML={createMarkup(parsePattern(el, templateToString))}></td>
                  <td style={{width: "200px"}}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                      {!readonly && (
                        <>
                          {parent === 'form' && (
                            <FaPenToSquare
                              size={18}
                              onClick={() => handleEdit(idx)}
                              style={{ cursor: 'pointer', margin: '0 2px 0 2px' }}
                            />
                          )}
                          <FaXmark
                            onClick={(e) => handleDelete(idx)}
                            size={18}
                            style={{ cursor: 'pointer', margin: '0 2px 0 2px' }}
                          />
                        </>
                      )}
                      {readonly && parent === 'form' && (
                        <FaEye
                          size={18}
                          onClick={() => handleEdit(idx)}
                          style={{ cursor: 'pointer', margin: '0 2px 0 2px' }}
                        />
                      )}
                    </div>
                  </td>
                </tr> : null
              ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default FragmentList;
