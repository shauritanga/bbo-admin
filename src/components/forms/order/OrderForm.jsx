import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Select from "../../select";
import { addOrder } from "../../../reducers/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputPicker, Modal, Notification, toaster } from "rsuite";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { calculateFees } from "../../../utils/getFees";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";

const OrderForm = ({ open, setOpen, size, title }) => {
  const [securities, setSecurities] = useState([]);
  const [security, setSecurity] = useState("");
  const [holding, setHolding] = useState("");
  const [customers, setCustomers] = useState([]);

  const { orders, status, error } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/customers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching customers: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCustomers(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/securities`)
      .then((response) => response.json())
      .then((data) => setSecurities(data))
      .catch((error) => console.log(error));
  }, []);

  if (!security && !customers) {
    return;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const client = customers?.filter(
      (customer) => customer.id === values.client_id
    );
    // if (values.type.toLowerCase() === "buy") {
    //   if (client[0].wallet < values.total) {
    //     alert(
    //       `You don't have enough balance to carry this transaction, your current balance is ${client[0].wallet}`
    //     );
    //     return;
    //   }
    //   dispatch(addOrder(values));
    //   setOpen(false);
    //   return;
    // }

    // alert(JSON.stringify(values, null, 2));
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/orders`,
        values
      );
      setSubmitting(false);
      await toaster.push(
        <Notification header="Success" type="success">
          Order created successfully
        </Notification>,
        {
          duration: 4000,
          placement: "topCenter",
        }
      );
      setOpen(false);
    } catch (error) {
      await toaster.push(
        <Notification header="Success" type="success">
          {error.response.data.message}
        </Notification>,
        {
          duration: 4000,
          placement: "topCenter",
        }
      );
    }
  };

  const clients = customers.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <Modal
      backdrop="static"
      open={open}
      onClose={() => setOpen(false)}
      size={700}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: "100%" }}>
        <Formik
          initialValues={{
            client_id: "",
            date: null,
            volume: "",
            price: "",
            type: "",
            security_id: "",
            amount: "",
            total: "",
            total_fees: "",
            dse: "",
            vat: "",
            holding: "",
            mode: "market",
            brokerage: "",
            cmsa: "",
            fidelity: "",
            cds: "",
            total_commissions: "",
          }}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors = {};
            if (!values.client_id) {
              errors.client_id = "It is required";
            }
            if (!values.price) {
              errors.price = "price field is required";
            }
            if (!values.volume) {
              errors.volume = "volume field is required";
            }
            if (!values.date) {
              errors.date = "Date field is required";
            }
            if (!values.amount) {
              errors.amount = "Amount field is required";
            }
            if (!values.total_fees) {
              errors.total_fees = "Total fees field is required";
            }
            if (!values.total) {
              errors.total = "This field is required";
            }
            if (!values.type) {
              errors.type = "This field is required";
            }
            if (!values.holding) {
              errors.holding = "This field is required";
            }
            if (!values.security_id) {
              errors.security_id = "This field is required";
            }
            return errors;
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <FormRow>
                <FormGroup>
                  <label htmlFor="customer">Customer</label>
                  <InputPicker
                    data={clients}
                    name="client_id"
                    style={{
                      marginRight: "auto",
                      width: "100%",
                    }}
                    placeholder="Select Client"
                    onChange={(value) => setFieldValue("client_id", value)}
                  />
                  <ErrorMessage
                    name="client_id"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="date">Trading Date</label>
                  <Field
                    id="date"
                    type="date"
                    name="date"
                    style={fieldStyles}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="volume">Volume</label>
                  <Field
                    id="volume"
                    type="number"
                    name="volume"
                    value={values.volume}
                    style={fieldStyles}
                  />
                  <ErrorMessage
                    name="volume"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="price">Price</label>
                  <Field
                    id="price"
                    type="number"
                    name="price"
                    value={values.price}
                    style={fieldStyles}
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="amount">Amount(TZS)</label>
                  <Field
                    id="amount"
                    type="number"
                    name="amount"
                    value={values.amount}
                    style={fieldStyles}
                    onFocus={() =>
                      setFieldValue("amount", values.price * values.volume)
                    }
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="total_fees">Total Fees(TZS)</label>
                  <Field
                    id="total_fees"
                    name="total_fees"
                    type="number"
                    value={values.total_fees}
                    style={fieldStyles}
                    onFocus={() =>
                      setFieldValue(
                        "total_fees",
                        calculateFees(values.amount).totalCharges
                      )
                    }
                  />
                  <ErrorMessage
                    name="total_fees"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="total">Total(TZS)</label>
                  <Field
                    id="total"
                    type="number"
                    name="total"
                    value={values.total}
                    style={fieldStyles}
                    onFocus={() =>
                      setFieldValue(
                        "total",
                        calculateFees(values.amount).totalConsideration
                      )
                    }
                  />
                  <ErrorMessage
                    name="total"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="action">Action</label>
                  <Field
                    as="select"
                    name="type"
                    value={values.type}
                    style={fieldStyles}
                  >
                    <option value="" disabled>
                      Select Order Type
                    </option>
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <label htmlFor="customer">Order Type</label>
                  <Field
                    as="select"
                    value={values.holding}
                    name="holding"
                    style={fieldStyles}
                  >
                    <option value="" disabled>
                      Select Holdings
                    </option>
                    <option value="Bond">Bond</option>
                    <option value="Security">Security</option>
                  </Field>
                  <ErrorMessage
                    name="holding"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormGroup>
                {values.holding === "Security" && (
                  <FormGroup>
                    <label htmlFor="customer">Security</label>
                    <Field
                      as="select"
                      name="security_id"
                      value={values.security_id}
                      style={fieldStyles}
                    >
                      <option value="" disabled selected>
                        Select Security
                      </option>
                      {securities?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="security_id"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormGroup>
                )}
              </FormRow>

              <Button type="submit" appearance="primary">
                {isSubmitting ? <RotatingLines width="22" /> : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
                appearance="subtle"
              >
                Cancel
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
// `;
const fieldStyles = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  backgroundColor: "transparent",
  border: "0.5px solid #ccc",
};

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
`;
const TextInput = styled.input`
  width: 340px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 7px;
  font-size: 16px;
`;

export default OrderForm;
