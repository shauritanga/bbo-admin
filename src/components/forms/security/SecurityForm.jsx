import React, { useState } from "react";
import { Button, Modal, Notification, toaster } from "rsuite";
import styled from "styled-components";
import { addSecurity } from "../../../reducers/securitySlice";
import { useDispatch } from "react-redux";

const SecurityForm = ({ open, setOpen }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [price, setPrice] = useState("");
  const dispatch = useDispatch();

  const handleFormSubmit = async () => {
    const security = {
      name,
      number,
      price,
    };
    try {
      await dispatch(addSecurity(security)).unwrap();
      setOpen(false);
      toaster.push(
        <Notification type="success" header="Success">
          Security successfully created
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
    } catch (error) {}
  };
  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>New Security</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormWrapper>
          <Label>
            <span>Security</span>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ minWidth: "400px" }}
              placeholder="Name"
            />
          </Label>
          <Label>
            <span>Number</span>
            <TextInput
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              style={{ minWidth: "400px" }}
              placeholder="Number"
            />
          </Label>
          <Label>
            <span>Prcie</span>
            <TextInput
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ minWidth: "400px" }}
              placeholder="Price"
            />
          </Label>
        </FormWrapper>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleFormSubmit} appearance="primary">
          Ok
        </Button>
        <Button onClick={() => setOpen(false)} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 30px;
`;
const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: hsl(0deg 0% 0%);
`;
const TextInput = styled.input`
  height: 32px;
  width: 100%;
  margin-left: auto;
  background-color: inherit;
  border: 0.5px solid hsl(0deg 0% 70%);
  border-radius: 4px;
  color: inherit;
  padding: 10px;
`;
export default SecurityForm;
