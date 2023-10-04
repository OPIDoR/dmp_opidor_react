import React from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { createMarkup, parsePattern } from '../../utils/GeneratorUtils';

function FragmentList({ fragmentsList, handleEdit, handleDelete, parent = 'form', templateToString = [], tableHeader = null, readonly = false }) {
  return (
    <>
      {fragmentsList  && (
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
                  <td style={{ width: '100%', border: '1px solid #1C5170' }} dangerouslySetInnerHTML={createMarkup(parsePattern(el, templateToString))}></td>
                  <td style={{ border: '1px solid #1C5170' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                      {!readonly && (
                        <>
                          {parent === 'form' && (
                            <FaEdit
                              size={18}
                              onClick={() => handleEdit(idx)}
                              style={{ cursor: 'pointer', margin: '0 2px 0 2px' }}
                            />
                          )}
                          <IoIosClose
                            onClick={(e) => handleDelete(idx)}
                            size={18}
                            style={{cursor: 'pointer', margin: '0 2px 0 2px'  }}
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
