import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import styled from "styled-components";
import axios from "axios";
import { Notification, toaster } from "rsuite";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const RequestPassword = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <FormWrapper>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
              const response = await axios.post(
                `${
                  import.meta.env.VITE_BASE_URL
                }/auth/admin/request-reset-password`,
                values
              );

              setSubmitting(false);
              toaster.push(
                <Notification header="Success" type="success">
                  <p style={{ color: "green" }}> {response.data.message}</p>
                </Notification>,
                {
                  duration: 5000,
                  placement: "topCenter",
                }
              );
              setTimeout(() => navigate("/login", { replace: true }), 4000);
            } catch (error) {
              toaster.push(
                <Notification header="Error" type="error">
                  <p style={{ color: "red" }}>{error.response.data.message}</p>
                </Notification>,
                {
                  duration: 5000,
                  placement: "topCenter",
                }
              );
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                backgroundColor: "#fff",
                width: "100%",
              }}
            >
              <p>Enter your email to reset password</p>
              <Field
                name="email"
                style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
              />
              <ErrorMessage name="email" />
              <Button type="submit">
                {isSubmitting === true ? (
                  <RotatingLines
                    visible={true}
                    height="22"
                    width="22"
                    color="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </FormWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #ccc;
`;

const FormWrapper = styled.div`
  background-color: #fff;
  margin-top: 30px;
  padding: 20px;
  width: 25%;
  height: max-content;
`;

const Button = styled.button`
  background-color: hsl(243deg 50% 21%);
  padding: 10px;
  width: 100%;
  color: white;
  border-radius: 5px;
`;

export default RequestPassword;
