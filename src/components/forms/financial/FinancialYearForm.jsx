import React from "react";
import { Button, Modal, Notification, toaster } from "rsuite";
import styled from "styled-components";
import { addFinancialYear } from "../../../reducers/financialYearSlice";
import { useDispatch, useSelector } from "react-redux";
import Select from "../../select";

const FinancialYearForm = ({ open, setOpen }) => {
  const [name, setName] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [status, setStatus] = React.useState("active");
  const dispatch = useDispatch();
  const {
    financialYears,
    status: status_,
    error,
  } = useSelector((state) => state.financialYears);

  const handleSubmit = async () => {
    const formData = {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
    };
    try {
      setName("");
      setStartDate("");
      setEndDate("");
      setStatus("active");
      setOpen(false);
      await dispatch(addFinancialYear(formData));
      toaster.push(
        <Notification type="success" title="Success" header="Success">
          Financial year created successfully
        </Notification>,
        { duration: 5000, placement: "topCenter" }
      );
    } catch (error) {
      toaster.push(
        <Notification type="error" title="Error" header="Error">
          Failed to create financial year
        </Notification>,
        { duration: 5000, placement: "topCenter" }
      );
      setOpen(false);
    }
  };
  const handleStatusChange = (event) => {
    console.log(event.target.value);
    setStatus(event.target.value);
  };

  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>New Financial Year</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup>
            <FormControl>
              <Label>Name</Label>
              <TextInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Label>Start Date</Label>
              <TextInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <Label>End Date</Label>
              <TextInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Label>Status</Label>
              <Select value={status} onChange={handleStatusChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
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
  gap: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 15px;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
`;
const Label = styled.label`
  color: #333;
`;

const TextInput = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export default FinancialYearForm;
