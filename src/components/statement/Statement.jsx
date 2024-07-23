import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Statement = ({ id, transactions, orders }) => {
  // const [transactions, setTransactions] = useState([]);
  // const [orders, setOrders] = useState([]);

  let formatter = new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [transactionResponse, orderResponse] = await Promise.all([
  //         axios.get(`${import.meta.env.VITE_BASE_URL}/transactions/${id}`),
  //         axios.get(`${import.meta.env.VITE_BASE_URL}/orders/client/${id}`),
  //       ]);
  //       setTransactions(transactionResponse.data);
  //       setOrders(orderResponse.data);
  //     } catch (error) {}
  //   };
  //   fetchData();
  // }, []);

  // if (!transactions) {
  //   return <p>Loading...</p>;
  // }
  // let globalBalance = 0;

  // const updatedTransactions = transactions.map((transaction) => {
  //   const credit = parseFloat(transaction.credit);
  //   const debit = parseFloat(transaction.debit);

  //   // Update the global balance
  //   globalBalance += credit - debit;

  //   // Add the balance to the transaction
  //   return {
  //     ...transaction,
  //     balance: globalBalance,
  //   };
  // });

  const updatedTransactions = transactions?.filter(
    (trans) => trans.account_id === "62"
  );

  let globalBalance = 0;

  const displayedTransactions = updatedTransactions.map((transaction) => {
    const credit = parseFloat(transaction.credit);
    const debit = parseFloat(transaction.debit);

    // Update the global balance
    globalBalance += credit - debit;

    // Add the balance to the transaction
    return {
      ...transaction,
      balance: globalBalance,
    };
  });

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
        {displayedTransactions.map((transaction) => {
          const order = orders?.filter(
            (order) => order.id === transaction.order_id
          )[0];

          return (
            <TableDataRow key={transaction._id}>
              <TableDataCell>
                {dayjs(transaction.transaction_date).format("DD-MM-YYYY")}
              </TableDataCell>
              <TableDataCell>{transaction.action}</TableDataCell>
              <TableDataCell>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{transaction.reference}</span>
                  {transaction.category}
                </div>
              </TableDataCell>
              <TableDataCell>{transaction.description}</TableDataCell>
              <TableDataCell>{order?.volume}</TableDataCell>
              <TableDataCell>{order?.price}</TableDataCell>
              <TableDataCell>{transaction.debit}</TableDataCell>
              <TableDataCell>{transaction.credit}</TableDataCell>
              <TableDataCell>
                {formatter.format(transaction.balance)}
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
