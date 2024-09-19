import { useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import styled from "styled-components";
import { Formik, Form, ErrorMessage, Field } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Notification, toaster } from "rsuite";

const Login = () => {
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/otp`,
        values
      );
      toaster.push(
        <Notification header="Success" type="success">
          <p style={{ color: "green" }}>Please check your email for an OTP</p>
        </Notification>,
        { duration: 5000, placement: "topCenter" }
      );

      setTimeout(
        () => navigate("/otp", { state: { email: values.email } }),
        5000
      );
    } catch (error) {
      toaster.push(
        <Notification header="Error" type="error">
          {error.response.data.message}
        </Notification>,
        { duration: 5000, placement: "topCenter" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <FormWrapper>
        <FormContainer>
          <img
            src="../../alpha.png"
            alt="alpha logo"
            width={150}
            height={150}
            style={{ margin: "0 auto" }}
          />
          <h1 style={{ textAlign: "center" }}>Alpha Capital</h1>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};

              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.password) {
                errors.password = "Required";
              } else if (values.password.length < 8) {
                errors.password = "Password must be at least 6 characters";
              }
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form
                style={{
                  display: "flex",
                  width: "50%",
                  flexDirection: "column",
                  marginTop: "20px",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    outline: "none",
                    fontSize: "16px",
                  }}
                />
                <ErrorMessage name="email" component="div" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    outline: "none",
                    fontSize: "16px",
                  }}
                />
                <ErrorMessage name="password" component="div" />
                <p
                  style={{
                    color: "hsl(243deg 50% 21%)",
                    cursor: "pointer",
                    alignSelf: "flex-end",
                  }}
                  onClick={() => navigate("/reset-password-request")}
                >
                  Forgot Password?
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #007bff",
                    backgroundColor: "hsl(243deg 50% 21%)",
                    color: "#fff",
                    borderRadius: "4px",
                    outline: "none",
                    fontSize: "16px",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>
        </FormContainer>
      </FormWrapper>
    </Wrapper>
  );
};

const fieldStyles = {
  padding: "10px",
  borderRadius: "4px",
  width: "100%",
  height: "35px",
  border: "1px solid #ccc",
};

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  background-image: url("../../background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const FormWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: transparent;
`;

const FormContainer = styled.div`
  width: 35%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-radius: 4px;
  justify-content: center;
  height: 100%;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid hsl(0deg 0% 0%);
  background-color: hsl(243deg, 50%, 21%);
  color: hsl(250deg 50% 90%);
  height: 35px;
  padding: 10px;
  border-radius: 4px;
`;
const RememberMe = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const Help = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export default Login;
