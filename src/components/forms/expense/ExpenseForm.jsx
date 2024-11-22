import React, { useState, useEffect } from "react";
import { Modal, Notification, toaster } from "rsuite";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/utils/axiosConfig";
import { Formik, Field, ErrorMessage, Form } from "formik";
function generateExpenseReference() {
  const timestamp = Date.now().toString().slice(-7); // Last 7 digits of timestamp
  const randomNumber = Math.floor(Math.random() * 10000) // 4 random digits
    .toString()
    .padStart(4, "0"); // Pad with zeros to ensure 4 digits
  return timestamp + randomNumber;
}

const ExpenseForm = ({ open, setOpen }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymethodResponse, clientRespponse, accountResponse] =
          await Promise.all([
            axiosInstance.get(`/paymethods`),
            axiosInstance.get(`/customers`),
            axiosInstance.get(`/accounts`),
          ]);

        setPaymentMethod(paymethodResponse.data);
        setCustomers(clientRespponse.data);
        setAccounts(accountResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const ref = generateExpenseReference();

  const handleFormSubmit = async (values, { setSubimitting }) => {
    const ref = generateExpenseReference();
  };
  return (
    <Modal
      backdrop="static"
      open={open}
      onClose={() => setOpen(false)}
      size={700}
    >
      <Modal.Header>
        <Modal.Title>New Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: "100%" }}>
        <Formik
          initialValues={{
            date: null,
            amount: "0.0",
            reference: "",
            description: "",
            category: "",
            payee: "",
            account: "",
          }}
          onSubmit={handleFormSubmit}
        >
          {({ values }) => (
            <Form className="w-full">
              <div className="flex gap-4 items-center mb-6">
                <div className="flex flex-1 flex-col gap-1">
                  <label htmlFor="transaction-date">Transaction Date</label>
                  <Field
                    type="datetime-local"
                    id="transaction-date"
                    className="w-full p-1 text-sm outline-none border rounded"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label htmlFor="amount">Amount</label>
                  <Field
                    id="amount"
                    name="amount"
                    value={values.amount}
                    className="w-full p-1 text-sm outline-none border rounded"
                  />
                </div>
              </div>
              <div className="flex gap-4 items-center mb-6">
                <div className="flex flex-1 flex-col gap-1">
                  <label htmlFor="category">Category</label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    required
                    className="border p-1 outline-none rounded"
                    value={values.category}
                  >
                    <option value="">Select Category</option>
                    <option value="sale">Sale</option>
                    <option value="buy">Buy</option>
                  </Field>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label htmlFor="real-account">Real Account</label>
                  <Field
                    as="select"
                    id="real-account"
                    name="account"
                    value={values.account}
                    required
                    className="border p-1 outline-none rounded"
                  >
                    <option value="" disabled selected>
                      Select Account
                    </option>
                    {accounts?.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <div className="w-full flex gap-4">
                <div className="flex-1">
                  <Field
                    as="select"
                    id="payee"
                    name="payee"
                    value={values.payee}
                    required
                    className="w-full border p-1 rounded"
                  >
                    <option value="" disabled selected>
                      Select payee
                    </option>
                    {customers?.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="flex-1">
                  <Field
                    as="select"
                    className="w-full border p-1 outline-none rounded"
                    required
                  >
                    <option value="">Select Payment Method</option>
                    {paymentMethod.map((method) => (
                      <option value={method._id}>{method.name}</option>
                    ))}
                  </Field>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex flex-1 flex-col gap-1">
                  <label htmlFor="cheque">Cheque Number</label>
                  <Field
                    id="cheque"
                    name="cheque"
                    className="border rounded p-1 w-full"
                  />
                </div>
              </div>
              <div className="row">
                <div className="flex flex-1 flex-col gap-1">
                  <label htmlFor="Description">Description</label>
                  <Field
                    as="textarea"
                    name="text"
                    className="p-2 border rounded"
                  >
                    Description
                  </Field>
                  <div className="flex flex-row-reverse gap-4 mt-4">
                    <Button onClick={handleFormSubmit} appearance="primary">
                      Ok
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ExpenseForm;
