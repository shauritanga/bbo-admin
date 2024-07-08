import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import axios from "axios";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { Notification, toaster } from "rsuite";

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || searchParams.get("email")[0];
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    if (values.password !== values.confirm) {
      return alert("Password do not match");
    }
    try {
      const response = await axios.post(
        "https://api.alphafunds.co.tz/api/v1/auth/employees/reset-password",
        {
          email,
          password: values.password,
        }
      );
      setSubmitting(false);
      await toaster.push(
        <Notification
          style={{ color: "green" }}
          type="success"
          header="Success"
        >
          You have successfully reset your password.
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
      navigate("/login");
    } catch (error) {
      setSubmitting(false);
      await toaster.push(
        <Notification header="Error" type="error">
          {response.data.message}
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
    }
  };
  return (
    <Wrapper>
      <Formik
        initialValues={{ password: "", confirm: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.password) {
            errors.password = "Password is required";
          } else if (values.password.length < 8) {
            errors.password = "Password must be atleast 8 characters";
          }
          if (!values.confirm) {
            errors.confirm = "Confirm password is required";
          }
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              backgroundColor: "#fff",
              padding: "30px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <Field
                style={{
                  padding: "6px 10px",
                  width: "250px",
                  border: "0.5px solid #ccc",
                  borderRadius: "4px",
                }}
                type="password"
                name="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" style={errorStyle} />
            </div>
            <Field
              style={{
                padding: "6px 8px",
                width: "250px",
                border: "0.5px solid #ccc",
                borderRadius: "4px",
              }}
              type="password"
              name="confirm"
              placeholder="Confirm password"
            />
            <ErrorMessage name="confirm" style={errorStyle} />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "15px",
              }}
            >
              <Button type="submit">
                {isSubmitting ? (
                  <RotatingLines
                    visible={true}
                    height="25"
                    width="25"
                    color="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Send"
                )}
              </Button>
              <CancelButton>Cancel</CancelButton>
            </div>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

const errorStyle = {
  color: "red",
  fontSize: "12px",
  marginTop: "5px",
};

const Wrapper = styled.div`
  display: flex;
  background: linear-gradient(to left #ccc red);
  background-color: #f5f5f5;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background-color: #0b64fa;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 0.5px solid #0b64fa;
  color: #0b64fa;
`;

export default PasswordReset;
