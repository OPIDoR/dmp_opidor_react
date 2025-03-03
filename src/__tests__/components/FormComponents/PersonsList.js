import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import PersonsList from '../../../components/FormComponents/PersonsList';



const mockHandleEdit = jest.fn();
const mockHandleDelete = jest.fn();

const personsListProps = {
  personsList: [
    { lastName: "LastName1", firstName: "FirstName1", mbox: 'f.n@example.fr' },
    { lastName: "LastName2", firstName: "FirstName2", mbox: 'f.n2@example.fr' }
  ],
  handleEdit: mockHandleEdit,
  handleDelete: mockHandleDelete,
  tableHeader: "My Header"
}

afterEach(cleanup);

describe('PersonsList component', () => {
  test('component rendering without lines', async () => {
    const emptyPersonsListProps = { ...personsListProps, personsList: [], tableHeader: null }
    render(<PersonsList {...emptyPersonsListProps} />);

    expect(screen.getByTestId("persons-list-table")).toBeInTheDocument();
    expect(screen.getByTestId("persons-list-table-body")).toBeInTheDocument();
    expect(screen.getByTestId("persons-list-table-header")).toBeInTheDocument();
    expect(screen.queryByTestId(/persons-list-row-[0-9]+/i)).not.toBeInTheDocument();
  });

  test('component rendering with lines', async () => {
    const data = personsListProps.personsList;
    render(<PersonsList {...personsListProps} />);

    expect(screen.getByTestId("persons-list-table-header")).toHaveTextContent(personsListProps.tableHeader);
    expect(screen.getByTestId("persons-list-table-header")).toHaveTextContent("Roles");
    expect(screen.queryAllByTestId(/persons-list-row-[0-9]+/i)).toHaveLength(data.length);
    expect(screen.queryAllByTestId(/persons-list-row-edit-btn-[0-9]+/i)).toHaveLength(data.length);
    expect(screen.queryAllByTestId(/persons-list-row-delete-btn-[0-9]+/i)).toHaveLength(data.length);
    expect(screen.queryAllByTestId(/persons-list-row-show-btn-[0-9]+/i)).toHaveLength(0);
  });
  test('component not rendering edit button if parent is not form', async () => {
    const personsListInModalProps = {...personsListProps, parent: 'modal'};
    render(<PersonsList {...personsListInModalProps} />);
    expect(screen.queryAllByTestId(/persons-list-row-edit-btn-[0-9]+/i)).not.toBeInTheDocument();
  });
});
