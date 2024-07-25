import React, { useState } from "react";
import { Modal, Button, toaster, Notification } from "rsuite";
import styled from "styled-components";
import axios from "axios";
import { calculateFees } from "../../../utils/getFees";

const ExecutionForm = ({ open, setOpen, order, customerId, balance }) => {
  console.log(order);
  const [state, setState] = useState({
    settlement_date: null,
    trading_date: Date.now,
    slip: "",
    price: 0,
    executed: 0,
    type: order?.type,
  });
  const amount = state.price * state.executed;
  const fees = calculateFees(amount);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setState((prev) => {
      if (name === "executed") {
        return {
          ...prev,
          [name]: balance >= value ? value : balance,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        ...state,
        customer: customerId,
        order_id: order?.uid,
        amount,
        totalFees: Math.round((fees.totalCharges + Number.EPSILON) * 100) / 100,
        total:
          Math.round((fees.totalConsideration + Number.EPSILON) * 100) / 100,
        dse: Math.round((fees.dseFee + Number.EPSILON) * 100) / 100,
        cds: Math.round((fees.cdsFee + Number.EPSILON) * 100) / 100,
        csma: Math.round((fees.cmsaFee + Number.EPSILON) * 100) / 100,
        fidelity: Math.round((fees.fidelityFee + Number.EPSILON) * 100) / 100,
        vat: Math.round((fees.vat + Number.EPSILON) * 100) / 100,
        brokerage:
          Math.round((fees.totalCommission + Number.EPSILON) * 100) / 100,
      };

      console.log(postData);

      const dseData = {
        reference: state.slip,
        value: Math.round((fees.dseFee + Number.EPSILON) * 100) / 100,
      };
      const cdsData = {
        reference: state.slip,
        value: Math.round((fees.cdsFee + Number.EPSILON) * 100) / 100,
      };
      const csmaData = {
        reference: state.slip,
        value: Math.round((fees.cmsaFee + Number.EPSILON) * 100) / 100,
      };
      const vatData = {
        reference: state.slip,
        value: Math.round((fees.vat + Number.EPSILON) * 100) / 100,
      };
      const fidelityData = {
        reference: state.slip,
        value: Math.round((fees.fidelityFee + Number.EPSILON) * 100) / 100,
      };
      const brokerageData = {
        reference: state.slip,
        value: Math.round((fees.totalCommission + Number.EPSILON) * 100) / 100,
      };
      const { executionResponse, dseResponse } = await Promise.all([
        axios.post(`${import.meta.env.VITE_BASE_URL}/executions`, postData),
        axios.post(`${import.meta.env.VITE_BASE_URL}/dse`, dseData),
        axios.post(`${import.meta.env.VITE_BASE_URL}/vat`, vatData),
        axios.post(`${import.meta.env.VITE_BASE_URL}/cds`, cdsData),
        axios.post(`${import.meta.env.VITE_BASE_URL}/csma`, csmaData),
        axios.post(`${import.meta.env.VITE_BASE_URL}/fidelity`, fidelityData),
        axios.post(`${import.meta.env.VITE_BASE_URL}/brokerage`, brokerageData),
      ]);
      await toaster.push(
        <Notification header="Success" type="success">
          Data Saved Successfully
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      await toaster.push(
        <Notification header="Error" type="error">
          Data was not saved, try again
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
    }
  };

  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>New Execution</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup>
            <FormControl>
              <label htmlFor="trading_date">Trading Date</label>
              <TextInput
                name="trading_date"
                value={state.date}
                onChange={handleChange}
                type="date"
                id="trading_date"
              />
            </FormControl>
            <FormControl>
              <label htmlFor="settlement_date">Settlement Date</label>
              <TextInput
                name="settlement_date"
                value={state.date}
                onChange={handleChange}
                type="date"
                id="settlement_date"
              />
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <label htmlFor="slip">Slip No</label>
              <TextInput
                value={state.slip}
                name="slip"
                onChange={handleChange}
                type="text"
                id="date"
                placeholder="slip number"
              />
            </FormControl>
            <FormControl>
              <label htmlFor="price">Price</label>
              <TextInput
                name="price"
                value={state.price}
                onChange={handleChange}
                type="number"
                id="price"
                placeholder="price"
                min={0}
              />
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <label htmlFor="volume">Executed</label>
              <TextInput
                name="executed"
                value={state.executed}
                onChange={handleChange}
                type="number"
                id="volume"
                placeholder="volume"
                min={0}
              />
            </FormControl>
            <FormControl>
              <label htmlFor="amount">Amount</label>
              <TextInput
                disabled
                value={amount}
                type="number"
                id="amount"
                placeholder="volume"
                min={0}
              />
            </FormControl>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ backgroundColor: "hsl(243deg 50% 21%", color: "#fff" }}
          onClick={handleSubmit}
        >
          Create
        </Button>
        <Button
          style={{
            border: "1px solid hsl(243deg 50% 21%",
            color: "hsl(243deg 50% 21%",
          }}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;
const FormControl = styled.div`
  width: 100%;
  display: flex;
  gap: 4px;
  flex-direction: column;
`;
const TextInput = styled.input`
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 5px;
`;

export default ExecutionForm;
