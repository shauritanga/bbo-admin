import React, { useState } from "react";
import styled from "styled-components";
import Select from "../select";

const Account = ({ customer }) => {
  const [idValue, setIdValue] = useState(customer.idType);
  const [idNumber, setIdNumber] = useState(customer.idNumber);
  const [country, setCountry] = useState(customer.country);
  const [category, setCategory] = useState("");
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email);
  return (
    <Wrapper>
      <Title>Personal information</Title>
      <Form>
        <FormGroup>
          <Label htmlFor="cds">CDS Account</Label>
          <TextInput type="text" id="cds" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="bot-account">BOT Account</Label>
          <TextInput type="text" id="bot-account" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="full-name">Full Name</Label>
          <TextInput
            type="text"
            id="full-name"
            value={name}
            onChange={() => console.log(name)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <TextInput
            value={email}
            type="text"
            id="email"
            onChange={() => console.log(email)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="category">Select Category</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="default">Default</option>
            <option value="report">Report</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="country">Select Country</Label>
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="" disabled>
              Select Country
            </option>
            <option value="Uganda">Uganda</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Kenya">Kenya</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phone">Phone</Label>
          <TextInput
            value={phone}
            type="text"
            id="phone"
            onChange={() => console.log(phone)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="identity">Identity Type</Label>
          <Select value={idValue} onChange={(e) => setIdValue(e.target.value)}>
            <option value="" disabled>
              Select Type
            </option>
            <option value="voter">Voter ID</option>
            <option value="passport">Passport</option>
            <option value="national id">National ID</option>
            <option value="driving license">Driving Lisence</option>
            <option value="lisence">Certificate of Incorporation</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="identity-id">Identity ID</Label>
          <TextInput
            value={idNumber}
            type="text"
            id="identity-id"
            onChange={(e) => setIdNumber(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="bank">Bank</Label>
          <TextInput type="text" id="bank" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="bank-account">Bank Account</Label>
          <TextInput type="text" id="bank-account" />
        </FormGroup>
        <FormGroup style={{ marginTop: "14px" }}>
          <Label htmlFor="bank"></Label>
          <TextInput
            type="button"
            id="bank"
            value="Submit"
            style={{
              backgroundColor: "hsl(243deg, 50%, 21%)",
              color: "#fff",
              border: "none",
              padding: 9,
              fontSize: "1.1rem",
            }}
          />
        </FormGroup>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  padding: 20px;
  gap: 30px;
  padding-bottom: 50px;
  border-radius: 7px;
`;
const Title = styled.p`
  font-size: 1.2rem;
`;
const Form = styled.form`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 20px;
`;
const FormGroup = styled.div`
  display: flex;
  flex: 1;
  min-width: 48%;
  gap: 8px;
  flex-direction: column;
`;
const Label = styled.label`
  color: var(--color-dark);
`;
const TextInput = styled.input`
  display: flex;
  border: 1px solid grey;
  padding: 10px;
  border-radius: 7px;
  color: inherit;
  background-color: inherit;
`;
export default Account;
