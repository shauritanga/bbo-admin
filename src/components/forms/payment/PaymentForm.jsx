import React, { useState, useEffect } from "react";
import { Modal, Notification, toaster } from "rsuite";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Button } from "@/components/ui/button";
import "./pay.css";
import axios from "axios";
import { generateUniqueId } from "@/utils/generateId";

const PaymentForm = ({ open, setOpen }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymethodResponse, clientRespponse, accountResponse] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BASE_URL}/paymethods`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/customers`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/accounts`),
          ]);

        setPaymentMethod(paymethodResponse.data);
        setCustomers(clientRespponse.data);
        setAccounts(accountResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs once on component mount

  const handleSubmit = async (values, { setSubmitting }) => {
    alert(JSON.stringify(values, null, 2));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payments`,
        values
      );
      toaster.push(
        <Notification header="success" type="success">
          {response.data.message}
        </Notification>,
        {
          duration: 2000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      console.error("Error submitting payment:", error);
      toaster.push(<Notification></Notification>, {
        duration: 2000,
        placement: "topCenter",
      });
    }
  };

  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>
          <span className="font-semibold">New Payment</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            date: "",
            category: "",
            userId: "",
            accountId: "",
            amount: 0.0,
            description: "",
            reference: generateUniqueId(),
            paymentMethodId: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex w-full gap-4">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="date">Payment Date</label>
                  <Field
                    type="datetime-local"
                    name="date"
                    className="border rounded p-1 outline-none"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="amount">Amount</label>
                  <Field
                    name="amount"
                    id="amount"
                    min={0}
                    placeholder="Enter amount"
                    className="border rounded p-1 outline-none"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="category">Bank</label>
                  <Field
                    as="select"
                    type="datetime-local"
                    name="category"
                    className="border rounded p-1 outline-none"
                  >
                    <option value="" selected disabled>
                      Select Bank
                    </option>
                    <option value="NMB Trust">NMB Trust</option>
                    <option value="NMB Company">NMB Company</option>
                    <option value="NBC">NBC</option>
                  </Field>
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="account">Account</label>
                  <Field
                    as="select"
                    name="accountId"
                    id="account"
                    type="text"
                    min={0}
                    className="border rounded p-1 outline-none"
                  >
                    <option value="" selected disabled>
                      Select Account
                    </option>
                    {accounts.map((account) => (
                      <option value={account._id} key={account._id}>
                        {account.name}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="payee">Payee</label>
                  <Field
                    as="select"
                    type="text"
                    name="userId"
                    id="payee"
                    className="w-full border rounded outline-none p-1"
                  >
                    <option value="" selected disabled>
                      Select payee
                    </option>
                    {customers?.map((method) => (
                      <option key={method._id} value={method._id}>
                        {method.name}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="method">Payment Method</label>
                  <Field
                    as="select"
                    name="paymentMethodId"
                    id="method"
                    type="text"
                    min={0}
                    className="border rounded p-1 outline-none w-full"
                  >
                    <option value="" selected disabled>
                      Select method
                    </option>
                    {paymentMethod?.map((method) => (
                      <option value={method._id}>{method.name}</option>
                    ))}
                  </Field>
                </div>
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="desc">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  type="text"
                  id="desc"
                  className="w-full border rounded p-1 outline-none"
                />
              </div>
              <div className="flex flex-row-reverse gap-4">
                <Button
                  variant="link"
                  onClick={() => setOpen(false)}
                  className="bg-slate-50 text-gray-500"
                >
                  Cancel
                </Button>
                <Button type="submit">Ok</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentForm;
