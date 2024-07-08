import { Button, Modal, Notification, toaster } from "rsuite";
import styled from "styled-components";
import { countries } from "../../../utils/countries";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

const CustomerForm = ({ open, setOpen, size, title }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "https://api.alphafunds.co.tz/api/v1/customers/admin",
        values
      );
      setSubmitting(false);
      await toaster.push(
        <Notification
          style={{ color: "green" }}
          header="Success"
          type="success"
        >
          You have successfully created new customer
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      setSubmitting(false);
      await toaster.push(
        <Notification style={{ color: "red" }} header="Success" type="success">
          Customer creation fail, try again!
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 42,
      width: 340,
      minHeight: 35,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  //=============OPTION VALUES===========================
  const ids = [
    { value: "Passport", label: "Passport" },
    { value: "Driver's License", label: "Driver's License" },
    { value: "National ID", label: "National ID" },
    { value: "Voter's ID", label: "Voter's ID" },
    {
      value: "Certificate of Incorporation",
      label: "Certificate of Incorporation",
    },
  ];

  //============= END OPTION VALUES===========================

  return (
    <Modal
      backdrop="static"
      open={open}
      setOpen={setOpen}
      size={size}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: "100%" }}>
        <Formik
          initialValues={{
            name: "",
            cdsAccount: "",
            bankName: "",
            bankAccountNumber: "",
            country: "",
            email: "",
            phone: "",
            idType: "",
            idNumber: "",
            category: "",
            password: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormRow>
                <FormGroup>
                  <label htmlFor="cds">CDS Account</label>
                  <Field
                    style={fieldStyle}
                    id="cds"
                    name="cdsAccount"
                    placeholder="CDS Account"
                  />
                  <ErrorMessage name="cdsAccount" component="div" />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="customer">Full Name</label>
                  <Field
                    style={fieldStyle}
                    id="customer"
                    name="name"
                    type="text"
                    placeholder="Customer Name"
                  />
                  <ErrorMessage name="name" component="div" />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="bank">Bank Name</label>
                  <Field
                    style={fieldStyle}
                    name="bankName"
                    id="bank"
                    type="text"
                    placeholder="Bank Name"
                  />
                  <ErrorMessage name="bankName" component="div" />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="account">Account Number</label>
                  <Field
                    style={fieldStyle}
                    id="account"
                    type="text"
                    name="bankAccountNumber"
                    placeholder="Account Number"
                  />
                  <ErrorMessage name="bankAccountNumber" component="div" />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="category">Category</label>
                  <Field style={fieldStyle} as="select" name="category">
                    <option value="">Select Category</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="government">Government</option>
                  </Field>
                  <ErrorMessage name="category" component="div" />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="countries">Country</label>
                  <Field
                    style={fieldStyle}
                    as="select"
                    name="country"
                    id="countries"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.value}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="country" component="div" />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="phone">Phone</label>
                  <Field
                    style={fieldStyle}
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                  />
                  <ErrorMessage name="phone" component="div" />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="id">Identity Type</label>
                  <Field style={fieldStyle} as="select" name="idType">
                    <option value="">Select ID type</option>
                    {ids.map((id, index) => (
                      <option value={id.value} key={index}>
                        {id.value}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="idType" component="div" />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="idnumber">ID Number</label>
                  <Field
                    style={fieldStyle}
                    name="idNumber"
                    id="idnumber"
                    type="text"
                    placeholder="ID Number"
                  />
                  <ErrorMessage name="idNumber" component="div" />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="email">Email</label>
                  <Field
                    style={fieldStyle}
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email Address"
                  />
                  <ErrorMessage name="email" component="div" />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="password">Password</label>
                  <Field
                    style={fieldStyle}
                    type="password"
                    name="password"
                    id="password"
                  />
                  <ErrorMessage name="password" component="div" />
                </FormGroup>
              </FormRow>
              <FormRow>
                <Button type="submit" appearance="primary">
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                  appearance="subtle"
                >
                  Cancel
                </Button>
              </FormRow>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

const fieldStyle = {
  padding: "10px",
  border: "0.5px solid #ccc",
  borderRadius: "4px",
};
const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
`;

export default CustomerForm;
