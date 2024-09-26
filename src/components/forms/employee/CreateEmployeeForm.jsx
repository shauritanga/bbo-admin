import React, { useEffect, useState } from "react";
import { Modal, Notification, toaster } from "rsuite";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styled from "styled-components";
import { RotatingLines } from "react-loader-spinner";

const CreateEmployeeForm = ({ open, setOpen }) => {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const fetchRoles = async () => {
      const response = await axios.get(`/roles`);
      setRoles(response.data);
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`/employees`, values);
      setSubmitting(false);
      await toaster.push(
        <Notification header="Success" type="success">
          You have successfullya added an employee
        </Notification>,
        { duration: 5000, placement: "topCenter" }
      );
      setOpen(false);
    } catch (error) {
      setSubmitting(false);
      await toaster.push(
        <Notification header="Error" type="error">
          {error.response.data.message}
        </Notification>,
        { duration: 5000, placement: "topCenter" }
      );
    }
  };

  if (roles.length === 0) {
    return null;
  }
  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>Create Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            role: "",
            status: "",
            password: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="name">Full Name</label>
                <Field
                  style={{
                    width: "100%",
                    border: "0.5px solid #ccc",
                    borderRadius: "3px",
                    padding: "8px",
                  }}
                  id="name"
                  name="name"
                  placeholder="Name"
                />
                <ErrorMessage name="name" component="div" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="email">Email Address</label>
                <Field
                  style={{
                    width: "100%",
                    border: "0.5px solid #ccc",
                    borderRadius: "3px",
                    padding: "8px",
                  }}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMessage name="email" component="div" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="phone">Phone Number</label>
                <Field
                  style={{
                    width: "100%",
                    border: "0.5px solid #ccc",
                    borderRadius: "3px",
                    padding: "8px",
                  }}
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                />
                <ErrorMessage name="phone" component="div" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="role">Role</label>
                <Field
                  as="select"
                  name="role"
                  style={{
                    width: "100%",
                    border: "0.5px solid #ccc",
                    borderRadius: "3px",
                    padding: "8px",
                  }}
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </Field>

                <ErrorMessage name="role" component="div" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="role">Status</label>
                <Field
                  as="select"
                  name="status"
                  style={{
                    width: "100%",
                    border: "0.5px solid #ccc",
                    borderRadius: "3px",
                    padding: "8px",
                  }}
                >
                  <option value="" disabled>
                    Select a status
                  </option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Field>

                <ErrorMessage name="status" component="div" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="passoword"
                  style={{
                    width: "100%",
                    border: "0.5px solid #ccc",
                    borderRadius: "3px",
                    padding: "8px",
                  }}
                  id="password"
                />
                <ErrorMessage name="status" component="div" />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button type="submit">
                  {isSubmitting ? (
                    <RotatingLines
                      visible={true}
                      height="25"
                      width="25"
                      color="white"
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    "Create"
                  )}
                </Button>
                <CancelButton type="button" onClick={() => setOpen(false)}>
                  Cancel
                </CancelButton>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
const Button = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #4caf50;
  color: #4caf50;
`;

export default CreateEmployeeForm;
