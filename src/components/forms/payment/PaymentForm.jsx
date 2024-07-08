import React, { useState, useEffect } from "react";
import { Modal, Button, Notification, toaster } from "rsuite";
import "./pay.css";

const PaymentForm = ({ open, setOpen }) => {
  const [transactionDate, settransactionDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [payee, setPayee] = useState(null);
  const [category, setCategory] = useState(null);
  const [realAccount, setRealAccount] = useState(null);
  const [customers, setCustomers] = useState(null);

  const payment = {
    transactionDate,
    amount,
    reference,
    description,
    method: paymentMethodId,
    payee,
    category,
    realAccount,
    status: "pending",
  };

  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(
          "https://api.alphafunds.co.tz/api/v1/paymethods"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPaymentMethod(data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        // Consider displaying an error message to the user
      } finally {
        setIsLoading(false); // Data loaded, set isLoading to false
      }
    };
    fetchPaymentMethods();
  }, []); // Empty dependency array ensures this runs once on component mount

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          "https://api.alphafunds.co.tz/api/v1/customers"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        // Consider displaying an error message to the user
      }
    };

    fetchCustomers();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://api.alphafunds.co.tz/api/v1/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payment),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
                <option value="">Real Account</option>
                <optgroup label="Accounts">
                  <option value="purchases">purchase</option>
                  <option value="expenses">expense</option>
                </optgroup>
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
                  <option value={method._id}>{method.name}</option>
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

export default PaymentForm;
