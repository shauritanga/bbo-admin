import React, { useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";

import { Notification, toaster } from "rsuite";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/provider/AuthProvider";
import { axiosInstance } from "@/utils/axiosConfig";

const validationSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be 6 characters"),
});

const AutoSubmit = () => {
  const { values, submitForm, isValid, touched } = useFormikContext();
  useEffect(() => {
    // Automatically submit the form when it is valid and touched
    if (isValid && Object.keys(touched).length > 0) {
      submitForm();
    }
  }, [values, isValid, touched, submitForm]);

  return null;
};
const Otp = () => {
  const { state } = useLocation();
  const { setUserToken } = useAuth();
  const navigate = useNavigate;

  if (!state) {
    return null;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values);

    try {
      const result = await axiosInstance.post(`/auth/verify-otp`, values);
      setSubmitting(false);
      await toaster.push(
        <Notification header="Success" type="success">
          {result.data.message}
        </Notification>,
        { duration: 3000, placement: "topCenter" }
      );
      setUserToken(result.data.token);
    } catch (error) {
      await toaster.push(
        <Notification header="Error" type="error">
          {error.response.data.message}
        </Notification>,
        { duration: 3000, placement: "topCenter" }
      );
    }
  };
  // Handle form submission logic, e.g., sending data to an API

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-400  to-blue-950">
      {/* <p>An OTP has been sent to your email:{state.email}</p> */}
      <div className="bg-white p-4 rounded">
        <p>Enter the OTP sent to your email</p>
        <Formik
          initialValues={{ otp: "", email: state.email }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form style={{ display: "flex", flexDirection: "column" }}>
              <InputOTP
                maxLength={6}
                onChange={(value) => setFieldValue("otp", value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button type="submit" className="mt-4">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
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
  padding: 8px 15px;
  font-size: 16px;
  cursor: pointer;
`;

export default Otp;
