import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { DatePicker, Input, InputPicker, Notification, toaster } from "rsuite";
import styled from "styled-components";
import "rsuite/InputNumber/styles/index.css";
import Select from "../../components/select";
import ExecutionForm from "../../components/forms/execution/ExecutionForm";
import dayjs from "dayjs";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { axiosInstance } from "@/utils/axiosConfig";
import ContractNoteDownload from "@/components/pdf/PrintContractPDF";

const data = ["Bond", "Security"].map((item) => ({
  label: item,
  value: item,
}));

const OrderView = () => {
  const { state } = useLocation();
  const [order, setOrder] = useState(null);
  const [openExecutionForm, setOpenExecutionForm] = useState(false);
  const [executions, setExecutions] = useState(null);
  const [securities, setSecurities] = useState([]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const DeleteOrder = async (orderId) => {
    try {
      const response = await axiosInstance.delete(`/orders/${orderId}`);
      await toaster.push(
        <Notification type="success" header="Success">
          {response.data.message}
        </Notification>,
        {
          placement: "topCenter",
          duration: 3000,
        }
      );
      navigate("/orders/?q=all");
    } catch (error) {
      await toaster.push(
        <Notification type="error" header="Error">
          {response.error.data.message}
        </Notification>,
        {
          placement: "topCenter",
          duration: 3000,
        }
      );
      return;
    }
  };

  const updateOrder = async (values, { setSubmitting }) => {
    alert(JSON.stringify(values, null, 2));

    try {
      setSubmitting(true);
      const response = await axiosInstance.patch(
        `/orders/${state.order?._id}`,
        values
      );
      setSubmitting(false);
      await toaster.push(
        <Notification type="success" header="Success">
          {response.data.message}
        </Notification>,
        { duration: 3000, placement: "topCenter" }
      );
    } catch (error) {
      setSubmitting(false);
      await toaster.push(
        <Notification type="success" header="Success">
          {response.data.error.message}
        </Notification>,
        { duration: 3000, placement: "topCenter" }
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Promise.all([
          axiosInstance.get(`/orders/${state.orderId}`),
          axiosInstance.get(`/executions/${state.orderId}`),
          axiosInstance.get(`/customers`),
          axiosInstance.get(`/securities`),
        ]);

        setOrder(data[0].data);
        setExecutions(data[1].data);
        setClients(data[2].data);
        setSecurities(data[3].data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (order === null || executions === null) {
    return <div>Loading...</div>;
  }

  const balance = order?.volume - order?.executed;
  return (
    <Wrapper>
      <Main>
        <Balance className="">
          Order Balance: {balance}
          <Formik
            initialValues={{
              customer: order.user?.name,
              date: order?.date ? new Date(order?.date) : "",
              volume: order?.volume ?? 0,
              price: order?.price ?? 0,
              amount: order?.amount ?? 0,
              type: order?.type.toLowerCase() ?? "",
              security: order.security?.name ?? "",
              holding: order?.holding,
            }}
            onSubmit={updateOrder}
          >
            {({ values, setFieldValue, isSubmitting }) => {
              useEffect(() => {
                const newAmount = values.volume * values.price;
                setFieldValue("amount", newAmount);
              }, [values.volume, values.price, setFieldValue]);
              return (
                <Form>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col w-full gap-1">
                      <label htmlFor="customer">Customer</label>
                      <Field
                        as="select"
                        name="customer"
                        value={values.customer}
                        className="w-full border rounded py-2"
                      >
                        <option value="">Select Customer</option>
                        {clients?.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label htmlFor="">Order Date</label>
                      <DatePicker
                        id="date"
                        format="yyyy-MM-dd" // Format for date input
                        value={values.date}
                        onChange={(date) => setFieldValue("date", date)}
                        className="w-full border rounded"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col w-full gap-1">
                      <label htmlFor="volume">Volume</label>
                      <Field
                        name="volume"
                        value={values.volume}
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label htmlFor="price">Price</label>
                      <Field
                        name="price"
                        type="text"
                        value={values.price}
                        className="w-full border rounded p-2"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col w-full gap-1">
                      <label htmlFor="amount">Amount</label>
                      <Field
                        name="amount"
                        readOnly
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label htmlFor="type">Order Type</label>
                      <Field
                        as="select"
                        name="type"
                        value={values.type}
                        className="w-full border rounded p-2"
                      >
                        <option value="" selected disabled>
                          Select Type
                        </option>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                      </Field>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col w-full gap-1">
                      <label htmlFor="holding">Security/Bond</label>
                      <Field
                        as="select"
                        name="holding"
                        value={values.holding}
                        className="w-full border rounded p-2"
                      >
                        <option value="" selected disabled>
                          Select Security/Bond
                        </option>
                        <option value="Security">Security</option>
                        <option value="Bond">Bond</option>
                      </Field>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label htmlFor="security">Security</label>
                      <Field
                        as="select"
                        name="security"
                        value={values.security}
                        className="w-full border rounded p-2"
                      >
                        <option value="" disabled selected>
                          Select Security
                        </option>
                        {securities?.map((security, index) => (
                          <option key={index} value={security.name}>
                            {security.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  {/* <div className="flex w-full">
                  <div className="flex flex-col w-full">
                    <label htmlFor=""></label>
                  <Field as="textarea" />
                  </div>
                </div> */}
                  <div className="flex w-full justify-end">
                    <Button type="submit" className="w-max">
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Balance>
        <Execution>
          <ExecutionHeader>
            <p>Activities</p>
            <Button
              style={{
                backgroundColor: "hsl(243deg, 50%, 21%)",
                color: "#fff",
              }}
              onClick={() => setOpenExecutionForm(true)}
            >
              New Execution
            </Button>
          </ExecutionHeader>
          <ExecutionTable>
            <ExecetionTableHeaderRow>
              <ExecutionTableHeaderCell>Date</ExecutionTableHeaderCell>
              <ExecutionTableHeaderCell>slip no</ExecutionTableHeaderCell>
              <ExecutionTableHeaderCell>price</ExecutionTableHeaderCell>
              <ExecutionTableHeaderCell>executed</ExecutionTableHeaderCell>
              <ExecutionTableHeaderCell>amount</ExecutionTableHeaderCell>
              <ExecutionTableHeaderCell>action</ExecutionTableHeaderCell>
            </ExecetionTableHeaderRow>
            {executions?.length === 0 ? (
              <ExecutionTableDataRow>
                <ExecutionTableDataCell colSpan={6}>
                  Not execution yet!
                </ExecutionTableDataCell>
              </ExecutionTableDataRow>
            ) : (
              executions?.map((execution) => (
                <ExecutionTableDataRow>
                  <ExecutionTableDataCell>
                    {dayjs(execution.trade_date).format("DD-MM-YYYY")}
                  </ExecutionTableDataCell>
                  <ExecutionTableDataCell>
                    {execution.slip}
                  </ExecutionTableDataCell>
                  <ExecutionTableDataCell>
                    {execution.price}
                  </ExecutionTableDataCell>
                  <ExecutionTableDataCell>
                    {execution.executed}
                  </ExecutionTableDataCell>
                  <ExecutionTableDataCell>
                    {Intl.NumberFormat("sw-TZ", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }).format(execution.amount)}
                  </ExecutionTableDataCell>
                  <ExecutionTableDataCell
                    style={{ display: "flex", gap: "40px" }}
                  >
                    <ExecutionAction
                    // onClick={() => {
                    //   const url = `/contract?execution=${JSON.stringify(
                    //     execution
                    //   )}`;
                    //   const title = "Contract";
                    //   return window.open(url, title);
                    // }}
                    >
                      <ContractNoteDownload data={execution} />
                    </ExecutionAction>
                    <ExecutionAction
                      onClick={() =>
                        navigate(`/dealing/${execution._id}`, {
                          state: execution,
                        })
                      }
                    >
                      view
                    </ExecutionAction>
                  </ExecutionTableDataCell>
                </ExecutionTableDataRow>
              ))
            )}
          </ExecutionTable>
        </Execution>
      </Main>
      <Aside>
        <Portfolio>
          <Avatar></Avatar>
          <Table>
            <tbody>
              <tr>
                <TableDataCell colSpan={2} style={{ textAlign: "center" }}>
                  Customer Portfolio
                </TableDataCell>
              </tr>
              <tr>
                <TableDataCell colSpan={2} style={{ textAlign: "center" }}>
                  {state.client?.name}
                </TableDataCell>
              </tr>
              <tr>
                <TableDataCell>CDS</TableDataCell>
                <TableDataCell>6754009</TableDataCell>
              </tr>
              <tr>
                <TableDataCell>Balance</TableDataCell>
                <TableDataCell>
                  {Intl.NumberFormat("sw-TZ", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }).format(state.client?.wallet)}
                </TableDataCell>
              </tr>
              <tr>
                <TableDataCell>Shares</TableDataCell>
                <TableDataCell>540</TableDataCell>
              </tr>
              <tr>
                <TableDataCell>Status</TableDataCell>
                <TableDataCell>
                  <span
                    style={{
                      backgroundColor: "hsl(0deg 0% 95%",
                      padding: "3px 6px",
                      color:
                        state.client?.status.toLowerCase() === "pending"
                          ? "#f2a356"
                          : "#000",
                      borderRadius: "999px",
                    }}
                  >
                    {state.client?.status}
                  </span>
                </TableDataCell>
              </tr>
            </tbody>
          </Table>
        </Portfolio>
        <Actions>
          <Button
            style={{ backgroundColor: "hsl(243deg, 50%, 21%)", color: "#fff" }}
          >
            Print
          </Button>
          <Button style={{ backgroundColor: "#61C478", color: "#fff" }}>
            Approve
          </Button>
          <Button style={{ backgroundColor: "#F2A356", color: "#fff" }}>
            Reset
          </Button>
          <Button
            onClick={() => DeleteOrder(state.order._id)}
            style={{ backgroundColor: "#D95E5A", color: "#fff" }}
          >
            Cancel
          </Button>
        </Actions>
      </Aside>
      <ExecutionForm
        balance={order?.volume - order?.executed}
        open={openExecutionForm}
        setOpen={setOpenExecutionForm}
        customerId={order?.user._id}
        order={order}
        security={state.security?.name ?? ""}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 30px;
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 5;
  gap: 20px;
  background-color: transparent;
  border-radius: 7px;
`;
const Balance = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 7px;
  padding: 20px;
`;

const Execution = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #fff;
  border-radius: 7px;
  padding: 20px;
`;
const ExecutionHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;
const ExecutionTable = styled.table`
  width: 100%;
`;
const ExecetionTableHeaderRow = styled.tr`
  width: 100%;
  background-color: hsl(0deg 0% 90%);
`;
const ExecutionTableHeaderCell = styled.th`
  text-transform: uppercase;
  text-align: left;
  padding: 8px 10px;
`;
const ExecutionTableDataRow = styled.tr``;
const ExecutionTableDataCell = styled.td`
  padding: 8px 10px;
`;

const ExecutionAction = styled.span`
  background-color: hsl(0deg 0% 90%/0.5);
  padding: 4px 8px;
  color: #61c478;
  border-radius: 999px;
  cursor: pointer;
`;
const Aside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 7px;
  background-color: inherit;
  gap: 30px;
`;
const Portfolio = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-radius: 7px;
  background-color: #fff;
`;
const Avatar = styled.div`
  height: 56px;
  width: 56px;
  background-color: red;
  border-radius: 50%;
`;
const Table = styled.table`
  width: 100%;
`;

const TableDataCell = styled.td`
  border: 1px solid black;
  padding: 10px;
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-radius: 7px;
  background-color: #fff;
`;
export default OrderView;
