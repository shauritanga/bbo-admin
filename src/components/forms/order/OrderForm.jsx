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
import { SearchSelect } from "@/components/SerachSelect";
import { axiosInstance } from "@/utils/axiosConfig";

const OrderForm = ({ open, setOpen, size, title }) => {
  const [securities, setSecurities] = useState([]);
  const [security, setSecurity] = useState("");
  const [holding, setHolding] = useState("");
  const [customers, setCustomers] = useState([]);

  const { orders, status, error } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Promise.all([
          axiosInstance.get("/customers"),
          axiosInstance.get("/securities"),
        ]);
        setCustomers(response[0].data);
        setSecurities(response[1].data);
      } catch (error) {}
    };
    fetchData();
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
      const response = await axiosInstance.post(`/orders`, values);
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
      await toaster.push(
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

  const clients = customers.map((item) => ({
    label: item.name,
    value: item._id,
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
            userId: "",
            date: null,
            volume: "",
            price: "",
            type: "",
            securityId: "",
            amount: "",
            total: "",
            totalFees: "",
            holding: "",
          }}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors = {};
            if (!values.userId) {
              errors.userId = "It is required";
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
            if (!values.totalFees) {
              errors.totalFees = "Total fees field is required";
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
            if (!values.securityId) {
              errors.securityId = "This field is required";
            }
            return errors;
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="flex w-full gap-4">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="customer">Customer</label>
                  <InputPicker
                    data={clients}
                    name="userId"
                    style={{
                      marginRight: "auto",
                      width: "100%",
                    }}
                    placeholder="Select Client"
                    onChange={(value) => setFieldValue("userId", value)}
                  />
                  <ErrorMessage
                    name="userId"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="date">Trading Date</label>
                  <Field
                    id="date"
                    type="datetime-local"
                    name="date"
                    style={fieldStyles}
                    className="w-full border rounded p-1"
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
              </div>
              <div className="w-full flex gap-4">
                <div className="w-full flex flex-col gap-1">
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
                </div>
                <div className="w-full flex flex-col gap-1">
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
                </div>
              </div>
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
                  <label htmlFor="totalFees">Total Fees(TZS)</label>
                  <Field
                    id="totalFees"
                    name="totalFees"
                    type="number"
                    value={values.totalFees}
                    style={fieldStyles}
                    onFocus={() =>
                      setFieldValue(
                        "totalFees",
                        calculateFees(values.amount).totalCharges
                      )
                    }
                  />
                  <ErrorMessage
                    name="totalFees"
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
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
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
                      name="securityId"
                      value={values.securityId}
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
                      name="securityId"
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
