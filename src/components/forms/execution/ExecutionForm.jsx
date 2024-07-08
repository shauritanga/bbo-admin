import React, { useState } from "react";
import { Modal, Button } from "rsuite";
import styled from "styled-components";
import axios from "axios";
import { calculateFees } from "../../../utils/getFees";

const ExecutionForm = ({ open, setOpen, orderId, customerId }) => {
  const [state, setState] = useState({
    date: Date.now,
    slip: "",
    price: 0,
    executed: 0,
  });

  const amount = state.price * state.executed;
  const fees = calculateFees(amount);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setState((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    const postData = {
      ...state,
      customer: customerId,
      order: orderId,
      amount,
      totalFees: Math.round((fees.totalCharges + Number.EPSILON) * 100) / 100,
      total: Math.round((fees.totalConsideration + Number.EPSILON) * 100) / 100,
      dse: Math.round((fees.dseFee + Number.EPSILON) * 100) / 100,
      cds: Math.round((fees.cdsFee + Number.EPSILON) * 100) / 100,
      csma: Math.round((fees.cmsaFee + Number.EPSILON) * 100) / 100,
      fidelity: Math.round((fees.fidelityFee + Number.EPSILON) * 100) / 100,
      vat: Math.round((fees.vat + Number.EPSILON) * 100) / 100,
      brokerage:
        Math.round((fees.totalCommission + Number.EPSILON) * 100) / 100,
    };

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
      axios.post(`https://api.alphafunds.co.tz/api/v1/executions`, postData),
      axios.post(`https://api.alphafunds.co.tz/api/v1/dse`, dseData),
      axios.post(`https://api.alphafunds.co.tz/api/v1/vat`, vatData),
      axios.post(`https://api.alphafunds.co.tz/api/v1/cds`, cdsData),
      axios.post(`https://api.alphafunds.co.tz/api/v1/csma`, csmaData),
      axios.post(`https://api.alphafunds.co.tz/api/v1/fidelity`, fidelityData),
      axios.post(
        `https://api.alphafunds.co.tz/api/v1/brokerage`,
        brokerageData
      ),
    ]);

    setOpen(false);
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
              <label htmlFor="date">Date</label>
              <TextInput
                name="date"
                value={state.date}
                onChange={handleChange}
                type="date"
                id="date"
              />
            </FormControl>
            <FormControl>
              <label htmlFor="date">Slip No</label>
              <TextInput
                value={state.slip}
                name="slip"
                onChange={handleChange}
                type="text"
                id="date"
                placeholder="slip number"
              />
            </FormControl>
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
          <FormGroup>
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
