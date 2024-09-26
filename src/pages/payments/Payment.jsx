import React, { useEffect, useState } from "react";
import "./payment.css";
import Search from "../../components/search/Search";
import dayjs from "dayjs";
import CheckBox from "../../components/checkbox/CheckBox";
import styled from "styled-components";
import PaymentForm from "../../components/forms/payment/PaymentForm";
import { Button } from "@/components/ui/button";
import axios from "axios";
import * as XLSX from "xlsx";
import { Pagination, Stack } from "@mui/material";
import { axiosInstance } from "@/utils/axiosConfig";
import { PaymentDataTable } from "@/components/payment/table";

function Payment() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [payments, setPayments] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const itemsPerPage = 10; // Number of items to show per page

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const updatePayment = async (selected, status) => {
    for (let item in selected) {
      const response = await axiosInstance.patch(
        `/transactions/payments/${selected[item]._id}`,
        JSON.stringify(status)
      );
      const json = await response.json();
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await axiosInstance.get(`transactions/payments`);
      const data = response.data;

      //xlsx
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "Payments.xlsx");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelect = (value, obj) => {
    if (value) {
      setSelected([...selected, obj]);
    } else {
      setSelected(selected.filter((item) => item._id !== obj._id));
    }
  };

  const selectAll = (value) => {
    if (value) {
      setSelected(payments);
    } else {
      setSelected([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentResponse, clientResponse] = await Promise.all([
          axiosInstance.get(`transactions/payments`),
          axiosInstance.get(`/customers`),
        ]);
        console.log(paymentResponse);
        setPayments(paymentResponse.data);
        setClients(clientResponse.data);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, [currentPage]);

  if (!clients || !payments) {
    return <div>Loading</div>;
  }

  const paymentTableData = payments?.map((receipt) => {
    const payee = clients.filter((client) => client._id === receipt.userId)[0];
    return {
      id: receipt?.uid ?? "",
      name: payee?.name,
      status: receipt.status,
      amount: receipt.amount,
      date: receipt.transactionDate,
      description: receipt.description,
    };
  });

  console.log(payments);
  return (
    <div className="flex flex-col gap-4 my-4">
      <TableWrapper>
        <PaymentDataTable customers={payments} />
      </TableWrapper>
      <PaymentForm open={openForm} setOpen={setOpenForm} />
    </div>
  );
}

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 7px;
  justify-content: space-between;
  height: 600px;
`;
const Table = styled.table``;
const TableHeaderRow = styled.tr`
  border-bottom: 1px solid hsl(0deg 0% 70%);
  background-color: hsl(0deg 0% 80%);
`;
const TableHeaderCell = styled.th`
  text-align: left;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 10px 20px;
`;
const TableDataRow = styled.tr`
  border-bottom: 1px solid #ccc;
  &:nth-of-type(odd) {
    background-color: hsl(250deg 50% 99%);
  }
`;
const TableDataCell = styled.td`
  font-size: 0.75rem;
  padding: 10px 20px;
`;
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;
const Counter = styled.p``;
const Pages = styled.div``;
export default Payment;
