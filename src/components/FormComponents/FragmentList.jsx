import React from 'react';
import { createMarkup, parsePattern } from '../../utils/GeneratorUtils';


function FragmentList({ fragmentsList, handleEdit, handleDelete, parent = 'form', templateToString = [], tableHeader = null, readonly = false }) {
  return (
    <>
      {fragmentsList  && (
        <table style={{ marginTop: "20px" }} className="table table-hover">
          <thead>
            {fragmentsList.length > 0 &&
              fragmentsList.some((el) => el.action !== "delete") && (
                <tr>
                  <th scope="col">{tableHeader}</th>
                  <th scope="col">Actions</th>
                </tr>
              )}
          </thead>
          <tbody>
            {fragmentsList
              .map((el, idx) => (el.action !== "delete" ?
                <tr key={idx}>
                  <td scope="row" style={{ width: "100%" }} dangerouslySetInnerHTML={createMarkup(parsePattern(el, templateToString))}></td>
                  <td className="actions">
                    {!readonly && (
                      <>
                        {parent === 'form' && (
                          <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                            <i className="fa fa-pen-to-square" />
                          </a>
                        )}
                        <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDelete(e, idx)}>
                          <i className="fa fa-xmark" />
                        </a>
                      </>
                    )}
                    {readonly && parent === 'form' && (
                      <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                        <i className="fa fa-eye" />
                      </a>
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

export default FragmentList;
