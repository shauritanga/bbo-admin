import React, { useState, useEffect } from "react";
import { Modal, Button, Notification, toaster } from "rsuite";
import "./pay.css";
import axios from "axios";

const PaymentForm = ({ open, setOpen }) => {
  const [transactionDate, setTransactionDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [payee, setPayee] = useState(null);
  const [category, setCategory] = useState(null);
  const [realAccount, setRealAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState(null);

  const payment = {
    transaction_date: transactionDate,
    amount,
    reference,
    description,
    payment_method_id: paymentMethodId,
    client_id: payee,
    category: "payment",
    account_id: realAccount,
    status: "new",
  };

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

  if (paymentMethod === null || customers === null || realAccount === null) {
  }
  console.log(realAccount);
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payments`,
        payment
      );
      toaster.push(
        <Notification header="success" type="success">
          Your payment has been successfully processed
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
        <Modal.Title>New Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="" className="payment-modal-form">
          <div className="row">
            <div className="payment-modal-form-control">
              <label htmlFor="transaction-date">Transaction Date</label>
              <input
                type="date"
                placeholder="dd-mm-yyyy"
                id="transaction-date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
              />
            </div>
            <div className="payment-modal-form-control">
              <label htmlFor="amount">Amount</label>
              <input
                type="text"
                placeholder="Amount"
                id="amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="payment-modal-form-control">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                required
                className="select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">Select Category</option>
                <optgroup label="Categories">
                  <option value="sale">Sale</option>
                  <option value="buy">Buy</option>
                </optgroup>
              </select>
            </div>
            <div className="payment-modal-form-control">
              <label htmlFor="real-account">Real Account</label>
              <select
                id="real-account"
                required
                className="select"
                value={realAccount}
                onChange={(event) => setRealAccount(event.target.value)}
              >
                <option value="" selected disabled>
                  Select Account
                </option>
                {accounts.map((account) => (
                  <option value={account.id} key={account._id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="payment-modal-form-control">
              <label htmlFor="payee">Payee</label>
              <select
                required
                className="select"
                value={payee}
                onChange={(event) => setPayee(event.target.value)}
              >
                <option value="">Select payee</option>
                {customers?.map((method) => (
                  <option value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>
            <div className="payment-modal-form-control">
              <label htmlFor="pay-method">Payement Method</label>
              <select
                className="select"
                required
                value={paymentMethodId}
                onChange={(event) => setPaymentMethodId(event.target.value)}
              >
                <option value="">Select Payment Method</option>
                {paymentMethod?.map((method) => (
                  <option value={method._id}>{method.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="payment-modal-form-control">
              <label htmlFor="cheque">Reference Number</label>
              <input
                type="text"
                placeholder="Chque Number"
                id="cheque"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="payment-modal-form-control">
              <label htmlFor="Description">Description</label>
              <textarea
                name="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              >
                Description
              </textarea>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleFormSubmit} appearance="primary">
          Ok
        </Button>
        <Button onClick={() => setOpen(false)} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentForm;
