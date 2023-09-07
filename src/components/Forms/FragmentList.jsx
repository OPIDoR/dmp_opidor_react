import React from 'react';
import { createMarkup, parsePattern } from '../../utils/GeneratorUtils';


function FragmentList({fragmentsList, template, tableHeader, readonly, level, handleEdit, handleDelete}) {

  return (
    <>
      {fragmentsList && template && (
        <table style={{ marginTop: "20px" }} className="table table-hover">
          <thead>
            {fragmentsList.length > 0 &&
              tableHeader &&
              fragmentsList.some((el) => el.action !== "delete") && (
                <tr>
                  <th scope="col">{tableHeader}</th>
                  <th scope="col">Actions</th>
                </tr>
              )}
          </thead>
          <tbody>
            {fragmentsList
              .filter((el) => el.action !== "delete")
              .map((el, idx) => (
                <tr key={idx}>
                  <td style={{ width: "100%" }} dangerouslySetInnerHTML={createMarkup(parsePattern(el, template.to_string))}></td>
                  <td className="actions">
                    {!readonly && (
                      <>
                        {level === 1 && (
                          <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                            <i className="fa fa-pen-to-square" />
                          </a>
                        )}
                        <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDelete(e, idx)}>
                          <i className="fa fa-times" />
                        </a>
                      </>
                    )}
                    {readonly && level === 1 && (
                      <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                        <i className="fa fa-eye" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default FragmentList;
