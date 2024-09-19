// import React, { useState } from "react";
// import { Modal, Notification, toaster } from "rsuite";
// import styled from "styled-components";
// import { useDispatch } from "react-redux";
// import { Formik, Form, ErrorMessage, Field } from "formik";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router";
// import axios from "axios";
// import { updateSecurity } from "@/reducers/securitySlice";

// const EditSecurityForm = ({ open, setOpen, data }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await axios.patch(
//         `${import.meta.env.VITE_BASE_URL}/securities/${data.id}`,
//         values
//       );
//       await toaster.push(
//         <Notification type="success" header="Success">
//           {response.data.message}
//         </Notification>,
//         {
//           duration: 3000,
//           placement: "topCenter",
//         }
//       );
//       setOpen(false);
//     } catch (error) {}
//   };
//   return (
//     <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
//       <Modal.Header>
//         <Modal.Title>Edit Security</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Formik
//           initialValues={{
//             _id: data.id,
//             name: data.name ?? "",
//             price: data.price ?? "0.0",
//           }}
//           validate={(values) => {
//             const errors = {};
//           }}
//           onSubmit={handleSubmit}
//         >
//           {({ values, isSubmitting }) => (
//             <Form className="flex flex-col gap-4">
//               <div className="w-full flex flex-col gap-1">
//                 <label htmlFor="name">Name</label>
//                 <Field
//                   name="name"
//                   type="text"
//                   value={values.name}
//                   className="border outline-none rounded p-1"
//                 />
//               </div>
//               <div className="w-full flex flex-col gap-1">
//                 <label htmlFor="price">Price</label>
//                 <Field
//                   name="price"
//                   type="number"
//                   value={values.price}
//                   className="border outline-none rounded p-1"
//                 />
//               </div>
//               <div>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Saving...." : "Save"}
//                 </Button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default EditSecurityForm;

import React from "react";
import { Modal, Notification, toaster } from "rsuite";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { updateSecurity } from "@/reducers/securitySlice";

const EditSecurityForm = ({ open, setOpen, data }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/securities/${data.id}`,
        values
      );
      dispatch(updateSecurity(response.data)); // Dispatching Redux action
      toaster.push(
        <Notification type="success" header="Success">
          {response.data.message}
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      console.error("Failed to update security: ", error);
      toaster.push(
        <Notification type="error" header="Error">
          {error.response?.data?.message || "An error occurred"}
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
      setErrors({ api: "Failed to update security" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>Edit Security</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            name: data.name ?? "",
            price: data.price ?? "0.0",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "Required";
            }
            if (isNaN(values.price) || values.price <= 0) {
              errors.price = "Price must be a positive number";
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, errors }) => (
            <Form className="flex flex-col gap-4">
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="name">Name</label>
                <Field
                  name="name"
                  type="text"
                  className="border outline-none rounded p-1"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="price">Price</label>
                <Field
                  name="price"
                  type="number"
                  className="border outline-none rounded p-1"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving...." : "Save"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default EditSecurityForm;
