import React, { useState } from "react";
import { Button, Modal } from "rsuite";
import styled from "styled-components";

const RoleForm = ({ open, setOpen }) => {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState({
    securities: { create: false, read: true, update: false, delete: false },
    orders: { create: true, read: true, update: true, delete: false },
    payments: { create: true, read: true, update: true, delete: false },
    receipts: { create: true, read: true, update: true, delete: false },
    expenses: { create: true, read: true, update: true, delete: false },
    transactions: { create: true, read: true, update: true, delete: false },
    roles: { create: true, read: true, update: true, delete: false },
  });

  const handleCheckboxChange = (resource, action) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [resource]: {
        ...prevPermissions[resource],
        [action]: !prevPermissions[resource][action],
      },
    }));
  };
  const handleSubmit = async () => {
    const role = {
      name,
      permissions,
    };
    const response = await fetch(`https://api.alphafunds.co.tz/api/v1/roles`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    setOpen(false);
    try {
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>New Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Wrapper>
          <Form>
            <FormControl>
              <label htmlFor="name">Role Name</label>
              <TextInput
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <label htmlFor="description">Role Name</label>
              <TextArea></TextArea>
            </FormControl>
            <span>Role Permissions</span>
            <Table style={{ width: "100%" }}>
              <thead>
                <TableHeaderRow>
                  <TableHeaderCell>Resource</TableHeaderCell>
                  <TableHeaderCell>Create</TableHeaderCell>
                  <TableHeaderCell>Read</TableHeaderCell>
                  <TableHeaderCell>Update</TableHeaderCell>
                  <TableHeaderCell>Delete</TableHeaderCell>
                </TableHeaderRow>
              </thead>
              <tbody>
                {Object.keys(permissions).map((resource) => (
                  <tr key={resource}>
                    <td>{resource}</td>
                    {["create", "read", "update", "delete"].map((action) => (
                      <td key={action}>
                        <input
                          type="checkbox"
                          checked={permissions[resource][action]}
                          onChange={() =>
                            handleCheckboxChange(resource, action)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Form>
        </Wrapper>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} appearance="primary">
          Ok
        </Button>
        <Button onClick={() => setOpen(false)} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Wrapper = styled.div``;
const Form = styled.form``;
const FormControl = styled.div`
  display: flex;
  flex-direction: column;
`;
const TextInput = styled.input`
  border: 1px solid hsl(0deg 0% 70%);
  padding: 8px 16px;
`;
const TextArea = styled.textarea`
  margin-bottom: 20px;
`;
const CheckBoxWrapper = styled.div`
  display: flex;
  gap: 30px;
`;
const CheckBox = styled.div`
  display: flex;
  gap: 10px;
`;

const Table = styled.table``;
const TableHeaderRow = styled.tr``;
const TableHeaderCell = styled.th`
  text-align: left;
`;
const TableDataRow = styled.tr``;
const TableDataCell = styled.tr``;
export default RoleForm;
