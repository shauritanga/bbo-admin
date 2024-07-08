import React, { useEffect, useState } from "react";
import { Button, Modal, Placeholder } from "rsuite";
import { fetchEmployees } from "../../../reducers/employeeSlice";
import { addCategory } from "../../../reducers/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Select from "../../select/Select";

const CreateCategoryForm = ({ open, setOpen }) => {
  const [isDefault, setIsDefault] = useState("");
  const [manager, setManager] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { employees, status, error } = useSelector((state) => state.employees);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleSubmit = () => {
    const category = {
      name,
      description,
      isDefault,
      manager,
    };
    console.log(category);
    dispatch(addCategory(category));
    setOpen(false);
  };

  if (status === "loading" || error) {
    return;
  }
  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>New Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup>
            <FormControl>
              <label htmlFor="name">Name</label>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
              />
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <label>Category Manager</label>
              <Select
                value={manager}
                onChange={(e) => setManager(e.target.value)}
              >
                <option value="" disabled>
                  Select Manager
                </option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <label>Default</label>
              <Select
                value={isDefault}
                onChange={(e) => setIsDefault(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </Select>
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <label htmlFor="textarea">Description</label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              ></TextArea>
            </FormControl>
          </FormGroup>
        </Form>
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const TextInput = styled.input`
  border: 1px solid #ccc;
  width: 100%;
  padding: 6px 10px;
  border-radius: 4px;
`;
const TextArea = styled.textarea`
  width: 100%;
`;

export default CreateCategoryForm;
