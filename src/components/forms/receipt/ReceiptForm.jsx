import React, { useState, useEffect } from "react";
import { Modal, Button } from "rsuite";
import "./receipt.css";

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
  const [realAccount, setRealAccount] = useState(null);

  const receipt = {
    transactionDate,
    amount,
    reference,
    description,
    method: paymentMethodId,
    payee,
    category,
    realAccount,
  };

  useEffect(() => {
    const fetchPayees = () => {
      fetch("https://api.alphafunds.co.tz/api/v1/customers", {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setClients(data))
        .catch((error) => console.log(error));
    };
    fetchPayees();
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = () => {
      fetch("https://api.alphafunds.co.tz/api/v1/paymethods", {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setPaymentMethod(data))
        .catch((error) => console.log(error));
    };
    fetchPaymentMethods();
  }, []);

  if (!paymentMethod) {
    return;
  }
  if (!clients) {
    return;
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(
      "https://api.alphafunds.co.tz/api/v1/receipts",
      {
        mode: "cors",
        method: "post",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(receipt),
      }
    );
    const res = await response.json();
    console.log(res);
    setOpen(false);
  };

  const handleCancelFormSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
  };
  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>New Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="" className="receipt-modal-form">
          <div className="row">
            <div className="receipt-modal-form-control">
              <label htmlFor="transaction-date">Transaction Date</label>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                id="transaction-date"
                value={transactionDate}
                onChange={(event) => settransactionDate(event.target.value)}
              />
            </div>
            <div className="receipt-modal-form-control">
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
            <div className="receipt-modal-form-control">
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
            <div className="receipt-modal-form-control">
              <label htmlFor="real-account">Real Account</label>
              <select
                id="real-account"
                required
                className="select"
                value={realAccount}
                onChange={(event) => setRealAccount(event.target.value)}
              >
                <option value="">Real Account</option>
                <optgroup label="Accounts">
                  <option value="purchases">purchase</option>
                  <option value="expenses">expense</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="receipt-modal-form-control">
              <label htmlFor="payee">Payee</label>
              <select
                required
                className="select"
                value={payee}
                onChange={(event) => setPayee(event.target.value)}
              >
                <option value="">Select payee</option>
                {clients?.map((payee) => (
                  <option value={payee._id}>{payee.name}</option>
                ))}
              </select>
            </div>
            <div className="receipt-modal-form-control">
              <label htmlFor="pay-method">Payement Method</label>
              <select
                className="select"
                required
                value={paymentMethodId}
                onChange={(event) => setPaymentMethodId(event.target.value)}
              >
                <option value="">Select Payment Method</option>
                {paymentMethod.map((method) => (
                  <option value={method._id}>{method.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="receipt-modal-form-control">
              <label htmlFor="reference">Reference</label>
              <input
                type="text"
                placeholder="Reference"
                id="reference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="receipt-modal-form-control">
              <label htmlFor="Description">Reference</label>
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

export default ReceiptForm;
