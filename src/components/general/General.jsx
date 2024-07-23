import React, { useState } from "react";
import styled from "styled-components";

const General = () => {
  const [companyName, setCompanyName] = useState("Alpha Capital");
  const [address, setAddress] = useState("P.O.Box 70166 Dar es salaam");
  const [email, setEmail] = useState("info@alphacapital.co.tz");
  const [website, setWebsite] = useState("https://www.alphacapital.co.tz");
  const [fax, setFax] = useState("");
  const [telephone, setTelephone] = useState("0763631999");
  const [about, setAbout] = useState("A blokerage company in east africa");
  return (
    <Wrapper>
      <Form>
        <FormGroup>
          <FormControl>
            <label htmlFor="name">Company Name</label>
            <TextInput
              value={companyName}
              type="text"
              onChange={({ value }) => setCompanyName(value)}
            />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl>
            <label htmlFor="address">Address</label>
            <TextInput
              value={address}
              type="text"
              onChange={({ value }) => setAddress(value)}
            />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl>
            <label htmlFor="email">Email</label>
            <TextInput
              value={email}
              type="text"
              onChange={({ value }) => setEmail(value)}
            />
          </FormControl>
          <FormControl>
            <label htmlFor="website">Website</label>
            <TextInput
              value={website}
              type="text"
              onChange={({ value }) => setWebsite(value)}
            />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl>
            <label htmlFor="fax">Fax</label>
            <TextInput
              value={fax}
              type="text"
              onChange={({ value }) => setFax(value)}
            />
          </FormControl>
          <FormControl>
            <label htmlFor="telephone">Telephone</label>
            <TextInput
              value={telephone}
              type="text"
              onChange={({ value }) => setTelephone(value)}
            />
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl>
            <label htmlFor="about">About</label>
            <TextArea
              value={about}
              onChange={({ value }) => setAbout(value)}
            ></TextArea>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <Button>Save Changes</Button>
        </FormGroup>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;
const FormGroup = styled.div`
  display: flex;
  width: 100%;
  gap: 30px;
`;
const FormControl = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
`;
const TextInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid hsl(0deg 0% 70%);
  border-radius: 5px;
`;
const TextArea = styled.textarea``;
const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  color: #fff;
  background-color: hsl(243deg 50% 21%);
`;
export default General;
