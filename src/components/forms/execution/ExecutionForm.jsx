import React, { useEffect } from "react";
import { DatePicker, Modal, Notification, toaster } from "rsuite";
import axios from "axios";
import { calculateFees } from "../../../utils/getFees";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/utils/axiosConfig";
import { date } from "yup";

const ExecutionForm = ({
  open,
  setOpen,
  order,
  customerId,
  balance,
  security,
}) => {
  const tradingDate = new Date(order.date);
  const settlementDate = new Date(tradingDate);
  settlementDate.setDate(settlementDate.getDate() + 3);

  const handleSubmit = async (values, { setsubmitting }) => {
    alert(JSON.stringify(values, null, 2));
    try {
      const response = await axiosInstance.post(`/transactions`, values);
      await toaster.push(
        <Notification header="Success" type="success">
          {response.data.message}
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      await toaster.push(
        <Notification header="Error" type="error">
          {error.response.data.message}
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
    }
  };

  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>New Execution: {balance}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            tradingDate: new Date(order?.date),
            settlementDate: settlementDate,
            executed: "",
            security: order.security,
            slip: "",
            price: order.price,
            amount: "",
            type: order?.type,
            userId: customerId,
            orderId: order?._id,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.tradingDate) {
              errors.tradingDate = "Please select date is required";
            }
            if (!values.settlementDate) {
              errors.settlementDate = "Please select settlement date";
            }
            if (!values.slip) {
              errors.slip = "Please a slip number";
            }
            if (!values.price) {
              errors.price = "Please enter price";
            }
            if (!values.executed) {
              errors.executed = "Please enter volume executed";
            } else if (parseInt(values.executed) > balance) {
              errors.executed = "You can not execute more than order balance";
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => {
            useEffect(() => {
              const amount = values.executed * values.price;
              setFieldValue("amount", amount);
            }, [values.executed, values.price, setFieldValue]);
            return (
              <Form>
                <div className="flex w-fulln gap-4 mb-4">
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="tradingDate">Trading Date</label>
                    <DatePicker
                      name="tradingDate"
                      value={values.tradingDate}
                      format="dd-MM-yyyy"
                      type="datetime-local"
                      className="w-full border rounded p-2"
                    />
                    <ErrorMessage
                      name="tradingDate"
                      component="div"
                      className="text-destructive"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="settlementDate">Settlement Date</label>
                    <DatePicker
                      name="settlementDate"
                      value={values.settlementDate}
                      type="datetime-local"
                      format="dd-MM-yyyy"
                      className="w-full border rounded p-2"
                    />
                    <ErrorMessage
                      name="settlementDate"
                      component="div"
                      className="text-destructive"
                    />
                  </div>
                </div>
                <div className="w-full flex gap-4 mb-4">
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="Slip">Slip No</label>
                    <Field
                      name="slip"
                      placeholder="slip number"
                      className="w-full border rounded p-2"
                    />
                    <ErrorMessage
                      name="slip"
                      component="div"
                      className="text-destructive"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="price">Price</label>
                    <Field
                      name="price"
                      placeholder="slip number"
                      className="w-full border rounded p-2"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-destructive"
                    />
                  </div>
                </div>
                <div className="w-full flex gap-4 mb-4">
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="executed">Executed</label>
                    <Field
                      name="executed"
                      placeholder="slip number"
                      max={balance}
                      className="w-full border rounded p-2"
                    />
                    <ErrorMessage
                      name="executed"
                      component="div"
                      className="text-destructive"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="amount">Amount</label>
                    <Field
                      name="amount"
                      readOnly
                      placeholder="slip number"
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>
                <div className="flex w-full justify-end gap-4">
                  <Button type="submit">
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ExecutionForm;
