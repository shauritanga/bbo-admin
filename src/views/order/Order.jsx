import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { DatePicker, Input, InputPicker } from "rsuite";
import styled from "styled-components";
import "rsuite/InputNumber/styles/index.css";
import Select from "../../components/select";
import ExecutionForm from "../../components/forms/execution/ExecutionForm";
import dayjs from "dayjs";
import axios from "axios";

const data = ["Bond", "Security"].map((item) => ({
  label: item,
  value: item,
}));

const OrderView = () => {
  const { state } = useLocation();
  const [client, setClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [action, setAction] = useState("");
  const [security, setSecurity] = useState(state.security?.name);
  const [securities, setSecurities] = useState(null);
  const [openExecutionForm, setOpenExecutionForm] = useState(false);
  const [executions, setExecutions] = useState(null);
  const navigate = useNavigate();
<<<<<<< Updated upstream
=======

  //
  const [formData, setFormData] = useState({
    customer: state?.client?.name ?? "",
    date: state?.order?.date ? new Date(state?.order?.date) : "", // Convert to Date object
    volume: state?.order?.volume ?? 0,
    price: state?.order?.price ?? 0,
    amount: state?.order?.amount ?? 0,
    type: state?.order?.type.toLowerCase() ?? "",
    security: state.security?.name ?? "",
  });

  const handleChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
>>>>>>> Stashed changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientResponse, securityResponse, executionResponse] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BASE_URL}/customers`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/securities`),
            axios.get(
              `${import.meta.env.VITE_BASE_URL}/executions/${state.order?.uid}`
            ),
          ]);

        const clientResult = clientResponse.data;
        const securityResult = securityResponse.data;
        const executionResult = executionResponse.data;
        setClients(clientResult);
        setSecurities(securityResult);
        setExecutions(executionResult);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (clients === null || securities === null) {
    return <div>Loading...</div>;
  }

  console.log(state.orders);
  return (
    <Wrapper>
      <Main>
        <Balance>
          Order Balance: {state.order?.volume - state.order?.executed}
          <Form>
            <FormGroup>
              <FormController>
                <label htmlFor="customer">Customer</label>
                <Select
                  value={formData.customer}
                  name="customer"
                  onChange={(e) => handleChange(e.target.value, "customer")}
                >
                  <option value="">Select Customer</option>
                  {clients?.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </FormController>
              <FormController>
                <label htmlFor="date">Order Date</label>

                <DatePicker
                  id="date"
<<<<<<< Updated upstream
                  type="date"
                  value={"4/7/2024"}
                  onChange={(e) => {
                    console.log(e);
                  }}
=======
                  format="yyyy-MM-dd" // Format for date input
                  value={formData.date}
                  onChange={(date) => handleChange(date, "date")}
>>>>>>> Stashed changes
                />
              </FormController>
            </FormGroup>
            <FormGroup>
              <FormController>
                <label htmlFor="volume">Volume</label>
                <TextInput
                  value={formData.volume}
                  type="number"
                  name="volume"
                  onChange={(e) => handleChange(e.target.value, "volume")}
                />
              </FormController>
              <FormController>
                <label htmlFor="price">Price</label>
                <TextInput
                  value={formData.price}
                  type="number"
                  onChange={(e) => handleChange(e.target.value, "price")}
                />
              </FormController>
            </FormGroup>
            <FormGroup>
              <FormController>
                <label htmlFor="amount">Amount(TZS)</label>
                <TextInput
                  disabled
                  value={formData.amount}
                  name="amount"
                  type="number"
                  onChange={(e) => handleChange(e.target.value, "amount")}
                />
              </FormController>
              <FormController>
                <label htmlFor="date">Order Type</label>
                <Select
                  value={formData.type}
                  name="type"
                  onChange={(e) => handleChange(e.target.value, "type")}
                >
                  <option value="">Select Type</option>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </Select>
              </FormController>
            </FormGroup>
            <FormGroup>
              <FormController>
                <label htmlFor="holding">Security/Bond</label>
                <InputPicker
                  data={data}
                  defaultValue={{ lable: action, value: action }}
                  style={{ width: "100%" }}
                  id="holding"
                  name="holding"
                  onChange={(security) => handleChange(security, "holding")}
                />
              </FormController>
              <FormController>
                <label htmlFor="security">Security</label>
                <Select
                  value={formData.security}
                  onChange={(e) => handleChange(e.target.value, "security")}
                >
                  <option value="">Select Security</option>
                  {securities?.map((security, index) => (
                    <option key={index} value={security.name}>
                      {security.name}
                    </option>
                  ))}
                </Select>
              </FormController>
            </FormGroup>
            <Input as="textarea" rows={3} placeholder="Textarea" />
          </Form>
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
                    {dayjs(execution.date).format("DD-MM-YYYY")}
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
                    {execution.amount}
                  </ExecutionTableDataCell>
                  <ExecutionTableDataCell
                    style={{ display: "flex", gap: "40px" }}
                  >
                    <ExecutionAction>approved</ExecutionAction>
                    <ExecutionAction
                      onClick={() => {
                        const url = `/contract?execution=${JSON.stringify(
                          execution
                        )}`;
                        const title = "Contract";
                        return window.open(url, title);
                      }}
                    >
                      PDF
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
                {}
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
          <Button style={{ backgroundColor: "#D95E5A", color: "#fff" }}>
            Cancel
          </Button>
        </Actions>
      </Aside>
      <ExecutionForm
        balance={state.order?.volume - state.order?.executed}
        open={openExecutionForm}
        setOpen={setOpenExecutionForm}
        customerId={state.order?.client_id}
        order={state.order}
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
const Form = styled.form`
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  gap: 20px;
`;
const FormGroup = styled.div`
  display: flex;
  gap: 30px;
`;
const FormController = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
`;
const TextInput = styled.input`
  border: 0.2px solid;
  border-radius: 7px;
  padding: 8px 15px;
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
  border: 1px solid;
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
const Button = styled.button`
  padding: 8px 10px;
  border-radius: 7px;
`;
export default OrderView;
