import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

const TransactionView = () => {
  const { state } = useLocation();
  const [methods, setMethods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymethodResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/paymethods`),
        ]);

        setMethods(paymethodResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  if (methods.length === 0) {
    return <div>Loading</div>;
  }

  const paymentMethod = methods.filter(
    (method) => method._id === state.transaction.payment_method_id
  );
  console.log(paymentMethod);
  return (
    <TransactionWrapper>
      <TransanctionDetails>
        <FormWrapper>
          <p>Transaction Details</p>
          <Form>
            <FormGroup>
              <FormControl>
                <Label htmlFor="date">Date</Label>
                <TextInput
                  disabled
                  value={dayjs(state.date).format("DD-MM-YYYY")}
                  type="text"
                  id="date"
                />
              </FormControl>
              <FormControl>
                <Label htmlFor="payee">Payee</Label>
                <TextInput
                  disabled
                  value={state.payee[0]?.name}
                  type="text"
                  id="payee"
                />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl>
                <Label htmlFor="reference">Reference</Label>
                <TextInput
                  disabled
                  value={state.transaction.reference}
                  type="text"
                  id="reference"
                />
              </FormControl>
              <FormControl>
                <Label htmlFor="category">Category</Label>
                <TextInput
                  disabled
                  type="text"
                  id="category"
                  value={state.transaction.category}
                />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl>
                <Label htmlFor="paymethod">Payment Method</Label>
                <TextInput
                  disabled
                  value={paymentMethod[0].name}
                  type="text"
                  id="paymethod"
                />
              </FormControl>
              <FormControl>
                <Label htmlFor="status">Status</Label>
                <TextInput
                  disabled
                  value={state.transaction.status}
                  type="text"
                  id="status"
                />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  disabled
                  value={state.transaction.description}
                  id="paymethod"
                ></TextArea>
              </FormControl>
            </FormGroup>
          </Form>
        </FormWrapper>
        <Account>
          <AccountTable>
            <thead>
              <AccountTableHeaderRow>
                <AccountTableHeaderCell>Account</AccountTableHeaderCell>
                <AccountTableHeaderCell>Debit</AccountTableHeaderCell>
                <AccountTableHeaderCell>Credit</AccountTableHeaderCell>
              </AccountTableHeaderRow>
            </thead>
            <tbody>
              <AccountTableDataRow>
                <AccountTableDataCell>Cash</AccountTableDataCell>
                <AccountTableDataCell>0</AccountTableDataCell>
                <AccountTableDataCell>3,679,790</AccountTableDataCell>
              </AccountTableDataRow>
              <AccountTableDataRow>
                <AccountTableDataCell>Service Charge</AccountTableDataCell>
                <AccountTableDataCell>3,679,790</AccountTableDataCell>
                <AccountTableDataCell>0</AccountTableDataCell>
              </AccountTableDataRow>
            </tbody>
          </AccountTable>
        </Account>
      </TransanctionDetails>
      <CustomerPortfolio>
        <Portfolio>
          <Avatar></Avatar>
          <Table>
            <tbody>
              <TableDataRow>
                <TableDataCell colSpan={2}>Customer Portfolio</TableDataCell>
              </TableDataRow>
              <TableDataRow>
                <TableDataCell colSpan={2}>
                  <span
                    style={{ cursor: "pointer", color: "hsl(243deg 50% 21%)" }}
                    onClick={() =>
                      navigate(`/customers/${state.payee?._id}`, {
                        state: state.payee,
                      })
                    }
                  >
                    {state.payee[0]?.name}
                  </span>
                </TableDataCell>
              </TableDataRow>
              <TableDataRow>
                <TableDataCell>CDS</TableDataCell>
                <TableDataCell>6513789</TableDataCell>
              </TableDataRow>
              <TableDataRow>
                <TableDataCell>Balance</TableDataCell>
                <TableDataCell>{state.payee[0]?.wallet}</TableDataCell>
              </TableDataRow>
              <TableDataRow>
                <TableDataCell>Shares</TableDataCell>
                <TableDataCell>452</TableDataCell>
              </TableDataRow>
              <TableDataRow>
                <TableDataCell>Status</TableDataCell>
                <TableDataCell>
                  <span>{state.payee[0]?.status}</span>
                </TableDataCell>
              </TableDataRow>
            </tbody>
          </Table>
        </Portfolio>
        <Actions>
          <Button>Back</Button>
          <RejectButton>Reject</RejectButton>
        </Actions>
      </CustomerPortfolio>
    </TransactionWrapper>
  );
};

const TransactionWrapper = styled.div`
  display: flex;
  gap: 30px;
`;
const TransanctionDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 4;
  gap: 30px;
`;
const FormWrapper = styled.div`
  padding: 30px;
  border-radius: 5px;
  background-color: hsl(0deg 0% 100%);
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 20px;
  width: 100%;
`;
const FormGroup = styled.div`
  display: flex;
  width: 100%;
  gap: 30px;
`;
const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;
const Label = styled.label`
  font-size: 0.87rem;
  color: hsl(0deg 0% 45%);
`;
const TextInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
`;
const TextArea = styled.textarea`
  padding: 10px;
  max-width: 100%;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Account = styled.div`
  border-radius: 5px;
  background-color: hsl(0deg 0% 100%);
`;
const AccountTable = styled.table`
  width: 100%;
`;
const AccountTableHeaderRow = styled.tr``;
const AccountTableHeaderCell = styled.th`
  text-align: left;
  text-transform: uppercase;
  padding: 10px;
  background-color: hsl(0deg 0% 70%);
  &:first-of-type {
    border-top-left-radius: 5px;
  }
  &:last-of-type {
    border-top-right-radius: 5px;
  }
`;
const AccountTableDataRow = styled.tr``;
const AccountTableDataCell = styled.td`
  padding: 10px;
`;
const CustomerPortfolio = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;
`;

const Portfolio = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: 7px;
  background-color: hsl(0deg 0% 100%);
`;
const Avatar = styled.div`
  height: 52px;
  width: 52px;
  background-color: var(--color-reject);
  border-radius: 50%;
`;
const Table = styled.table`
  width: 100%;
`;
const TableDataRow = styled.tr``;
const TableDataCell = styled.td`
  text-align: center;
  padding: 10px;
  border: 1px solid hsl(0deg 0% 80%);
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: transparent;
  padding: 30px;
  border: 1px solid hsl(243deg 50% 21%);
  border-radius: 7px;
`;
const Button = styled.button`
  width: 100%;
  padding: 8px 16px;
  background-color: hsl(243deg 50% 21%);
  color: #fff;
  border-radius: 7px;
  &:hover {
    box-shadow: 0px 15px 20px, inherit;
  }
`;
const RejectButton = styled(Button)`
  background-color: var(--color-reject);
`;
export default TransactionView;
