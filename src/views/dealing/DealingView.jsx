import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router";

const DealingView = () => {
  const { state } = useLocation();
  return (
    <Wrapper>
      <Main>
        <Header>Slip is approved</Header>
        <SlipDetail>
          <p style={{ marginBottom: "20px" }}>Slip Details</p>
          <Form>
            <FormGroup>
              <FormControl>
                <label htmlFor="slip">Slip No</label>
                <TextInput value={state.slip} type="text" disabled />
              </FormControl>
              <FormControl>
                <label htmlFor="slip">Slip No</label>
                <TextInput type="text" placeholder="647865" />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl>
                <label htmlFor="slip">Volume</label>
                <TextInput value={state.executed} type="text" disabled />
              </FormControl>
              <FormControl>
                <label htmlFor="slip">Amount</label>
                <TextInput value={state.amount} type="text" disabled />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl>
                <label htmlFor="slip">Total Fees(TZS)</label>
                <TextInput value={state.totalFees} type="text" disabled />
              </FormControl>
              <FormControl>
                <label htmlFor="slip">Total(TZS)</label>
                <TextInput value={state.total} type="text" disabled />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl>
                <label htmlFor="slip">DSE Fee</label>
                <TextInput value={state.dse} type="text" disabled />
              </FormControl>
              <FormControl>
                <label htmlFor="slip">CDS Fee</label>
                <TextInput value={state.cds} type="text" disabled />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl>
                <label htmlFor="slip">CSMA Fee</label>
                <TextInput value={state.csma} type="text" disabled />
              </FormControl>
              <FormControl>
                <label htmlFor="slip">Fidelity Fee</label>
                <TextInput value={state.fidelity} type="text" disabled />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl>
                <label htmlFor="slip">VAT Fee</label>
                <TextInput value={state.vat} type="text" disabled />
              </FormControl>
              <FormControl>
                <label htmlFor="slip">Brokerage Fee</label>
                <TextInput value={state.brokerage} type="text" disabled />
              </FormControl>
            </FormGroup>
          </Form>
        </SlipDetail>
      </Main>
      <Right></Right>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 5;
  gap: 10px;
`;
const Header = styled.p`
  background-color: hsl(160deg 50% 75%/0.2);
  padding: 10px;
  border-radius: 7px;
  color: hsl(160deg 100% 20%);
`;
const SlipDetail = styled.div`
  background-color: hsl(0deg 0% 100%);
  padding: 20px;
  border-radius: 5px;
`;
const Form = styled.form``;
const FormGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;
const FormControl = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
`;
const TextInput = styled.input`
  border: 0.5px solid hsl(0deg 0% 80%);
  padding: 6px;
  border-radius: 4px;
  width: 100%;
`;
const Right = styled.div`
  display: flex;
  flex: 2;
  background-color: red;
`;
export default DealingView;
