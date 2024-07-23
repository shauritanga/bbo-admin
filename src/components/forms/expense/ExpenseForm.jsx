import React, { useState, useEffect } from "react";
import { Button, Modal, Notification, toaster } from "rsuite";
import "./expense.css";
import axios from "axios";

function generateExpenseReference() {
  const timestamp = Date.now().toString().slice(-7); // Last 7 digits of timestamp
  const randomNumber = Math.floor(Math.random() * 10000) // 4 random digits
    .toString()
    .padStart(4, "0"); // Pad with zeros to ensure 4 digits
  return timestamp + randomNumber;
}

const ExpenseForm = ({ open, setOpen }) => {
  const [transactionDate, settransactionDate] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [payee, setPayee] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [category, setCategory] = useState(null);
  const [realAccount, setRealAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentMethodResponse, customerResponse, accountResponse] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BASE_URL}/paymethods`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/customers`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/accounts`),
          ]);
        setCustomers(customerResponse.data);
        setPaymentMethod(paymentMethodResponse.data);
        setAccounts(accountResponse.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        // Consider displaying an error message to the user
      } finally {
        setIsLoading(false); // Data loaded, set isLoading to false
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs once on component mount

  if (!paymentMethod) {
    return;
  }

  if (!customers) {
    return;
  }

  const ref = generateExpenseReference();

  const handleFormSubmit = async (event) => {
    const ref = generateExpenseReference();
    const payment = {
      transactionDate,
      amount,
      reference,
      description,
      method: paymentMethodId,
      payee,
      category,
      referenceNumber: ref,
      realAccount,
    };
    const transaction = {
      type: "expense",
      transactionDate,
      amount,
      referenceNumber: ref,
      description,
      method: paymentMethodId,
      payee,
      status: "pending",
    };
    event.preventDefault();

    try {
      const [expenseResponse, transactionResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_BASE_URL}/expenses`, {
          method: "post",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payment),
        }),
        fetch(`${import.meta.env.VITE_BASE_URL}/transactions`, {
          method: "post",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transaction),
        }),
      ]);

      if (!expenseResponse.ok) throw new Error("Error creating expense");
      if (!transactionResponse.ok)
        throw new Error("Error creating transaction");
      toaster.push(
        <Notification type="success" header="Success">
          Expense successfully created
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error">
          {error.message}
        </Notification>,
        {
          duration: 5000,
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
        <Modal.Title>New Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: "100%" }}>
        <form action="" className="payment-modal-form">
          <div className="row">
            <div className="payment-modal-form-control">
              <label htmlFor="transaction-date">Transaction Date</label>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                id="transaction-date"
                value={transactionDate}
                onChange={(event) => settransactionDate(event.target.value)}
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
                <option value="sale">Sale</option>
                <option value="buy">Buy</option>
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
                <option value="" disabled selected>
                  Select Account
                </option>
                {accounts.map((account) => (
                  <option value={account.id}>{account.name}</option>
                ))}
                <option value="purchases">purchase</option>
                <option value="expenses">expense</option>
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
                <option value="" disabled>
                  Select payee
                </option>
                {customers?.map((payee) => (
                  <option key={payee._id} value={payee._id}>
                    {payee.name}
                  </option>
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
                {paymentMethod.map((method) => (
                  <option value={method._id}>{method.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="payment-modal-form-control">
              <label htmlFor="cheque">Cheque Number</label>
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

export default ExpenseForm;
