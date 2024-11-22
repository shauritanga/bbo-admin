import { Button, Modal, Notification, toaster } from "rsuite";
import styled from "styled-components";
import { nationalities } from "../../../utils/nationalities";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { axiosInstance } from "@/utils/axiosConfig";

const CustomerForm = ({ open, setOpen, size, title }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.post(`/customers/admin`, values);
      setSubmitting(false);
      await toaster.push(
        <Notification
          style={{ color: "green" }}
          header="Success"
          type="success"
        >
          {response.data.message}
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      setSubmitting(false);
      console.log(error);
      await toaster.push(
        <Notification style={{ color: "red" }} header="Error" type="error">
          {error.response.data.message}
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
    { value: "Driving License", label: "Driving License" },
    { value: "National ID", label: "National ID" },
    { value: "Voter ID", label: "Voter's ID" },
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
      size={600}
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
            nationality: "",
            email: "",
            phone: "",
            occupation: "",
            dob: "",
            region: "",
            address: "",
            idType: "",
            idNumber: "",
            category: "",
            nextOfKinName: "",
            nextOfKinRelation: "",
            nextOfKinResidence: "",
            nextOfKinRegion: "",
            nextOfKinPhone: "",
            nextOfKinEmail: "",
            password: "password",
          }}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "Name is required";
            }
            if (!values.nationality) {
              errors.nationality = "Please select nationality";
            }
            if (!values.cdsAccount) {
              errors.cdsAccount = "CDS Account is required";
            }
            if (!values.dob) {
              errors.dob = "Birth date is required";
            }

            if (!values.email) {
              errors.email = "Name is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-2 m-2">
              <span className="font-semibold">Personal Details</span>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="cds">CDS Account</label>
                  <Field
                    id="cds"
                    name="cdsAccount"
                    placeholder="CDS Account"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="cdsAccount"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="customer">Full Name</label>
                  <Field
                    id="customer"
                    name="name"
                    type="text"
                    placeholder="Customer Name"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="category">Category</label>
                  <Field
                    as="select"
                    name="category"
                    className="border rounded p-1 text-sm outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="government">Government</option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="nationality">Nationality</label>
                  <Field
                    as="select"
                    name="nationality"
                    id="nationality"
                    className="border rounded p-1 text-sm outline-none"
                  >
                    <option value="">Select Nationality</option>
                    {nationalities.map((country) => (
                      <option key={country.country} value={country.nationality}>
                        {country.nationality}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="nationality"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="dob">Date of birth</label>
                  <Field
                    name="dob"
                    id="dob"
                    type="date"
                    placeholder=""
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="occupation">Occupation</label>
                  <Field
                    name="occupation"
                    id="occupation"
                    type="text"
                    placeholder="e.g Teacher"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="occupation"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="phone">Phone</label>
                  <Field
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="id">Identity Type</label>
                  <Field
                    as="select"
                    name="idType"
                    className="border rounded p-1 text-sm outline-none"
                  >
                    <option value="">Select ID type</option>
                    {ids.map((id, index) => (
                      <option value={id.value} key={index}>
                        {id.value}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="idType"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="idnumber">ID Number</label>
                  <Field
                    name="idNumber"
                    id="idnumber"
                    type="text"
                    placeholder="ID Number"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="idNumber"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="email">Email</label>
                  <Field
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="address">Physical Address</label>
                  <Field
                    name="address"
                    id="address"
                    type="text"
                    placeholder="Fupi St Basihaya, Bunju, Kinondoni, Dare es salaam"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="region">Region</label>
                  <Field
                    name="region"
                    id="region"
                    type="region"
                    placeholder="Your region"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="region"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <span className="font-semibold">Bank Account Details</span>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="bank">Bank Name</label>
                  <Field
                    name="bankName"
                    id="bank"
                    type="text"
                    placeholder="Bank Name"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="bankName"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="account">Account Number</label>
                  <Field
                    id="account"
                    type="text"
                    name="bankAccountNumber"
                    placeholder="Account Number"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="bankAccountNumber"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <span className="font-semibold">Next of Kin</span>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="nextOfKinName">Full Name</label>
                  <Field
                    name="nextOfKinName"
                    id="nextOfKinName"
                    type="text"
                    placeholder="Name"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="nextOfKinName"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="nextOfKinRelation">Relationship</label>
                  <Field
                    name="nextOfKinRelation"
                    id="nextOfKinRelation"
                    type="text"
                    placeholder="Your relation"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="nextOfKinRelation"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="nextOfKinResidence">Residence</label>
                  <Field
                    name="nextOfKinResidence"
                    id="nextOfKinResidence"
                    type="text"
                    placeholder="Residence"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="nextOfKinResidence"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="nextOfKinRegion">Region</label>
                  <Field
                    name="nextOfKinRegion"
                    id="nextOfKinRegion"
                    type="nextOfKinRegion"
                    placeholder="Region"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="nextOfKinRegion"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="nextOfKinPhone">Mobile</label>
                  <Field
                    name="nextOfKinPhone"
                    id="nextOfKinPhone"
                    type="tel"
                    placeholder="Mobile"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="nextOfKinPhone"
                    component="div"
                    className="text-destructive"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="nextOfKinEmail">Email</label>
                  <Field
                    name="nextOfKinEmail"
                    id="nextOfKinEmail"
                    type="nextOfKinEmail"
                    placeholder="Email"
                    className="border rounded p-1 text-sm outline-none"
                  />
                  <ErrorMessage
                    name="nextOfKinEmail"
                    component="div"
                    className="text-destructive"
                  />
                </div>
              </div>
              <div>
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
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CustomerForm;
