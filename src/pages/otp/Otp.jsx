import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { useAuth } from "../../provider/AuthProvider";
import { Notification, toaster } from "rsuite";

const Otp = () => {
  const { state } = useLocation();
  const { loginAction } = useAuth();
  if (!state) {
    return null;
  }
  return (
    <Wrapper>
      <p>An OTP has been sent to your email:{state.email}</p>
      <p>Enter the OTP</p>
      <Formik
        initialValues={{ otp: "", email: state.email }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const result = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`,
              values
            );
            await toaster.push(
              <Notification header="Success" type="success"></Notification>,
              { duration: 3000, placement: "topCenter" }
            );
            loginAction(result.data.email);
            setSubmitting(false);
          } catch (error) {
            await toaster.push(
              <Notification header="Success" type="success">
                {error.response.data.message}
              </Notification>,
              { duration: 3000, placement: "topCenter" }
            );
          }
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <Form
            // onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Field
              value={values.otp}
              name="otp"
              placeholder="Enter OTP"
              onChange={handleChange}
              style={{
                width: "300px",
                marginBottom: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                fontSize: "16px",
              }}
              type="text"
            />
            <ErrorMessage name="otp" />
            <Button>Verify</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  background-image: url("../../gradient.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  height: 100vh;
`;
const TextInput = styled.input`
  width: 300px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

export default Otp;
