import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { nationalities } from "../../utils/nationalities";
import { Notification, toaster } from "rsuite";
import { axiosInstance } from "@/utils/axiosConfig";

const Account = ({ customer }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await axiosInstance.patch(
        `/customers/${customer._id}`,
        values
      );
      setSubmitting(false);
      toaster.push(
        <Notification header="Success" type="success">
          {response.data.message}
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
    } catch (error) {
      toaster.push(
        <Notification header="Error" type="error">
          {error.response.data.message}
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
    }
  };

  const idNumber = customer?.idNumber;
  let idType = "";
  if (idNumber?.length > 13) {
    idType = "National ID";
  } else if (idNumber?.length >= 10) {
    idType = "driving licenses";
  } else {
    idType = "passport no";
  }

  return (
    <div className="bg-white p-2 shadow-md rounded">
      <Title>Personal information</Title>
      <Formik
        initialValues={{
          country: customer?.nationality,
          category: customer?.category,
          cdsAccount: customer?.dseAccount,
          name: customer?.name,
          phone: customer?.phone,
          email: customer?.email,
          idType: customer?.idType,
          idNumber: customer?.idNumber,
          botAccount: customer?.botAccount,
          bankName: customer?.bankName,
          bankAccount: customer?.bankAccountNumber,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form
            style={{
              display: "flex",
              width: "100%",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <FormGroup>
              <Label htmlFor="cds">CDS Account</Label>
              <Field
                type="text"
                id="cds"
                value={values.cdsAccount}
                name="cdsAccount"
                style={inputStyle}
                placeholder="CDS Account"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bot">BOT Account</Label>
              <Field
                type="text"
                id="bot"
                value={values.botAccount}
                name="botAccount"
                style={inputStyle}
                placeholder="BOT account"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Field
                type="text"
                id="name"
                name="name"
                value={values.name}
                style={inputStyle}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Field
                value={values.email}
                type="email"
                id="email"
                name="email"
                style={inputStyle}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="category">Select Category</Label>
              <Field as="select" style={inputStyle} value={values.category}>
                <option value="" disabled>
                  Select Category
                </option>
                <option value="individual">Individual</option>
                <option value="company">company</option>
                <option value="government">Government</option>
              </Field>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="country">Select Country</Label>
              <Field
                as="select"
                style={inputStyle}
                value={values.country}
                name="country"
              >
                <option value="" disabled>
                  Select country
                </option>
                {nationalities.map((country) => (
                  <option key={country.nationality} value={country.nationality}>
                    {country.country}
                  </option>
                ))}
              </Field>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">Phone</Label>
              <Field
                value={values.phone}
                type="text"
                id="phone"
                name="phone"
                style={inputStyle}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="identity">Identity Type</Label>
              <Field
                as="select"
                name="idType"
                id="identity"
                value={values.idType}
                style={inputStyle}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="voter">Voter ID</option>
                <option value="Passport">Passport</option>
                <option value="National ID">National ID</option>
                <option value="driving license">Driving Lisence</option>
                <option value="lisence">Certificate of Incorporation</option>
              </Field>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="idNumber">Identity ID</Label>
              <Field
                value={values.idNumber}
                type="text"
                id="idNumber"
                name="idNumber"
                style={inputStyle}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bank">Bank</Label>
              <Field
                value={values.bankName}
                type="text"
                id="bank"
                name="bankName"
                style={inputStyle}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bankaccount">Bank Account</Label>
              <Field
                value={values.bankAccount}
                type="text"
                id="bankaccount"
                name="bankAccount"
                placeholder="Bank Account"
                style={inputStyle}
              />
            </FormGroup>
            <FormGroup style={{ marginTop: "14px" }}>
              <label htmlFor=""></label>
              <button
                type="submit"
                style={{
                  backgroundColor: "hsl(243deg, 50%, 21%)",
                  color: "#fff",
                  border: "none",
                  padding: "11px",
                  marginTop: "5px",
                  borderRadius: "5px",
                }}
              >
                {isSubmitting ? "Updating..." : "Update customer"}
              </button>
            </FormGroup>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const inputStyle = {
  display: "flex",
  border: "1px solid grey",
  padding: "10px",
  borderRadius: "5px",
  color: "inherit",
  backgroundColor: "inherit",
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
const TextInput = styled.input``;
export default Account;
