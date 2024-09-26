import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useData } from "../../context/userContext";
import { Pagination, Stack } from "@mui/material";
import { axiosInstance } from "@/utils/axiosConfig";
import { StatementDataTable } from "./table";

const Statement = ({ id }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { transactions } = useData();
  let globalBalance = 0;

  let formatter = new Intl.NumberFormat("sw-TZ", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  useEffect(() => {
    const fetchUserTransactions = async () => {
      await axiosInstance.get(`/transactions/${id}`);
    };
  });

  const userTransactions = transactions
    ?.filter(
      (transaction) =>
        transaction.user?._id === id && transaction.status === "approved"
    )
    .sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));

  const displayedTransactions = userTransactions?.map((transaction) => {
    const credit = transaction.credit;
    const debit = transaction.debit;

    // Update the global balance
    globalBalance += credit - debit;

    // Add the balance to the transaction
    return {
      ...transaction,
      balance: globalBalance,
    };
  });

  return <StatementDataTable statements={displayedTransactions} />;
};

const Spacer = styled.div`
  flex: 1;
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

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;
const Counter = styled.p``;
const Pages = styled.div``;

export default Statement;
