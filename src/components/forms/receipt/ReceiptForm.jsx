import React, { useState, useEffect } from "react";
import { Modal, Button, toaster, Notification } from "rsuite";
import "./receipt.css";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import styled from "styled-components";
import { generateUniqueId } from "@/utils/generateId";
import { axiosInstance } from "@/utils/axiosConfig";

const ReceiptForm = ({ open, setOpen }) => {
  const [transactionDate, settransactionDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [payee, setPayee] = useState(null);
  const [clients, setClients] = useState([]);
  const [category, setCategory] = useState(null);
  const [realAccount, setRealAccount] = useState([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Promise.all([
          axiosInstance.get(`/paymethods`),
          axiosInstance.get(`/customers`),
          axiosInstance.get(`/accounts`),
        ]);

        setPaymentMethod(response[0].data);
        setClients(response[1].data);
        setRealAccount(response[2].data);
      } catch (error) {}
    };

    fetchData();
  }, []);

  if (!paymentMethod) {
    return;
  }
  if (!clients) {
    return;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      const response = await axiosInstance.post(`/transactions`, values);
      setSubmitting(false);
      await toaster.push(
        <Notification header="Success" type="success">
          {response.data.message}
        </Notification>,
        {
          duration: 4000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      toaster.push(
        <Notification header="Error" type="error">
          {error.response.data.message}
        </Notification>,
        {
          duration: 4000,
          placement: "topCenter",
        }
      );
    }
  };
  return (
    <Modal
      backdrop="static"
      open={open}
      onClose={() => setOpen(false)}
      size={700}
    >
      <Modal.Header>
        <Modal.Title>New Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            date: "",
            amount: "",
            reference: generateUniqueId(),
            category: "receipt",
            userId: "",
            accountId: "",
            paymentMethodId: "",
            status: "new",
            description: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form className="flex flex-col gap-2">
              <div className="flex gap-4">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="transaction-date">Transaction Date</label>
                  <Field
                    type="datetime-local"
                    placeholder="dd-mm-yyyy"
                    id="transaction-date"
                    name="date"
                    className="w-full border rounded text-sm outline-none p-1"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="amount">Amount</label>
                  <Field
                    type="text"
                    placeholder="Amount"
                    id="amount"
                    name="amount"
                    className="w-full border rounded text-sm outline-none p-1"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="category">Category</label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="w-full border rounded text-sm outline-none p-1"
                  >
                    <option value="" selected disabled>
                      Select Category
                    </option>
                    <option value="buy">Buy</option>
                  </Field>
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="real-account">Real Account</label>
                  <Field
                    as="select"
                    name="accountId"
                    className="w-full border rounded text-sm outline-none p-1"
                  >
                    <option value="" selected disabled>
                      Select account
                    </option>
                    {realAccount.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <Row>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="payee">Payee</label>
                  <Field
                    as="select"
                    className="w-full border rounded text-sm outline-none p-1"
                    name="userId"
                  >
                    <option value="" disabled>
                      Select payee
                    </option>
                    {clients?.map((payee) => (
                      <option value={payee._id}>{payee.name}</option>
                    ))}
                  </Field>
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="pay-method">Payement Method</label>
                  <Field
                    as="select"
                    name="paymentMethodId"
                    className="w-full border rounded text-sm outline-none p-1"
                  >
                    <option value="" disabled>
                      Select Payment Method
                    </option>
                    {paymentMethod.map((method) => (
                      <option value={method._id}>{method.name}</option>
                    ))}
                  </Field>
                </div>
              </Row>
              <Row>
                <div className="receipt-modal-form-control">
                  <label htmlFor="Description">Description</label>
                  <Field type="text" as="textarea" name="description">
                    Description
                  </Field>
                </div>
              </Row>
              <div className="row">
                <Button type="submit" appearance="primary">
                  Ok
                </Button>
                <Button onClick={() => setOpen(false)} appearance="subtle">
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

const Row = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  margin-bottom: 10px;
`;

export default ReceiptForm;
