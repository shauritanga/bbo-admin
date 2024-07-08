import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import styled from "styled-components";

const Statement = ({ id }) => {
  const [transactions, setTransactions] = React.useState([]);

  let formatter = new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.alphafunds.co.tz/api/v1/transactions/customer/${id}`
        );
        if (response.status === 200) {
          setTransactions(response.data);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  if (!transactions) {
    return <p>Loading...</p>;
  }
  return (
    <Wrapper>
      <p>Statement</p>
      <Table>
        <TableHeaderRow>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>type</TableHeaderCell>
          <TableHeaderCell>reference</TableHeaderCell>
          <TableHeaderCell>particulars</TableHeaderCell>
          <TableHeaderCell>quantity</TableHeaderCell>
          <TableHeaderCell>price</TableHeaderCell>
          <TableHeaderCell>debit</TableHeaderCell>
          <TableHeaderCell>credit</TableHeaderCell>
          <TableHeaderCell>balance</TableHeaderCell>
        </TableHeaderRow>
        {transactions.map((transaction) => {
          return (
            <TableDataRow key={transaction._id}>
              <TableDataCell>
                {dayjs(transaction.date).format("DD-MM-YYYY")}
              </TableDataCell>
              <TableDataCell>{transaction.type}</TableDataCell>
              <TableDataCell>{transaction.referenceNumber}</TableDataCell>
              <TableDataCell>{transaction.description}</TableDataCell>
              <TableDataCell>{}</TableDataCell>
              <TableDataCell>500</TableDataCell>
              <TableDataCell>0</TableDataCell>
              <TableDataCell>5500</TableDataCell>
              <TableDataCell>
                {formatter.format(transaction.amount)}
              </TableDataCell>
            </TableDataRow>
          );
        })}
      </Table>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: var(--color-white);
  border-radius: 7px;
  padding: 20px;
`;

const Table = styled.div`
  margin-top: 20px;
  width: 100%;
`;
const TableHeaderRow = styled.tr`
  display: flex;
  align-items: center;
  background-color: hsl(0deg 0% 80%);
  width: 100%;
`;
const TableHeaderCell = styled.th`
  text-transform: uppercase;
  font-weight: normal;
  text-align: left;
  padding: 8px 10px;
  width: 100%;
`;

const TableDataRow = styled.tr`
  display: flex;
  width: 100%;
`;
const TableDataCell = styled.td`
  width: 100%;
  border: none;
  vertical-align: bottom;
  padding: 8px 10px;
  border-bottom: 0.1px solid hsl(0deg 0% 70%);
`;

export default Statement;
