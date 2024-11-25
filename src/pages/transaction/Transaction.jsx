import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./transaction.css";
import CheckBox from "../../components/checkbox/CheckBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker, toaster, Notification } from "rsuite";
import styled from "styled-components";
import dayjs from "dayjs";
import { Pagination, Stack } from "@mui/material";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import axios from "axios";
import { axiosInstance } from "@/utils/axiosConfig";

function Transaction() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState("");
  const [customer, setCustomer] = useState("");
  const [transactions, setTransactions] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refetch, setRefetch] = useState("false");
  const itemsPerPage = 10; // Number of items to show per page

  const navigate = useNavigate();

  const exportToExcel = () => {
    try {
      const data = selected;
      alert(JSON.stringify(data, null, 2));

      //xlsx
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "Receipts.xlsx");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 42,
      width: 340,
      minHeight: 35,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const updateTransaction = async (selected, status) => {
    try {
      let response;
      for (let item in selected) {
        response = await axiosInstance.patch(
          `/transactions/${selected[item]._id}`,
          status
        );
      }

      await toaster.push(
        <Notification type="success" header="Success">
          {response.data.message}
        </Notification>,
        {
          duration: 3000,
          placement: "topCenter",
        }
      );
      setRefetch(true);
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error">
          {error.response.data.message}
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
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
      setSelected(expenses);
    } else {
      setSelected([]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Promise.all([
          axiosInstance.get(`/transactions`),
          axiosInstance.get(`/customers`),
        ]);
        setClients(response[1].data);
        setTransactions(response[0].data);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, [refetch]);

  if (!clients || !transactions) {
    return <div>Loading...</div>;
  }

  const clientOptions = clients?.map((client) => {
    return { lable: client.name, value: client.name };
  });

  return (
    <div className="flex flex-col gap-4  my-4 min-h-screen">
      <div className="flex items-center gap-4 bg-white shadow-md rounded p-2">
        <Select onValueChange={(value) => setCustomer(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Customer" />
          </SelectTrigger>
          <SelectContent>
            {clients?.map((customer) => (
              <SelectItem key={customer?._id} value={customer._id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateRangePicker
          format="dd-MM-yyyy"
          style={{
            border: "1px solid hsl(0deg 0% 80%)",
            borderRadius: "7px",
          }}
          placeholder="Select Date Range"
        />
        <Button>Filter</Button>
        <div
          className={`flex items-center gap-4 self-end ml-auto ${
            visible ? "block" : "hidden"
          }`}
        >
          <Button
            onClick={() => updateTransaction(selected, { status: "approved" })}
            className="bg-green-500 text-sm"
          >
            Approve
          </Button>
          <Button
            onClick={() =>
              updateTransaction(selected, { status: "disapproved" })
            }
            className="bg-red-500 text-sm"
          >
            Disapprove
          </Button>

          <Button onClick={exportToExcel} className="bg-blue-950 text-sm">
            Export(excel)
          </Button>
        </div>
      </div>
      <div className="transaction-table">
        <table style={{ width: "100%" }}>
          <thead>
            <TableHeaderRow>
              <TableHeaderCell style={{ width: 70, textAlign: "left" }}>
                <CheckBox
                  name="all"
                  value={selected.length === transactions.length}
                  visible={visible}
                  setVisible={setVisible}
                  updateValue={selectAll}
                />
              </TableHeaderCell>
              <TableHeaderCell>id</TableHeaderCell>
              <TableHeaderCell>payee</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>amount</TableHeaderCell>
              <TableHeaderCell>date</TableHeaderCell>
              <TableHeaderCell>status</TableHeaderCell>
            </TableHeaderRow>
          </thead>
          <tbody>
            {transactions?.map((transaction) => {
              return (
                <TableDataRow key={transaction._id}>
                  <TableDataCell>
                    <CheckBox
                      name={transaction}
                      value={selected.includes(transaction)}
                      visible={visible}
                      setVisible={setVisible}
                      updateValue={handleSelect}
                    />
                  </TableDataCell>
                  <TableDataCell>{transaction.uid}</TableDataCell>
                  <TableDataCell>{transaction.user?.name}</TableDataCell>
                  <TableDataCell>{transaction.description}</TableDataCell>
                  <TableDataCell>
                    <div>
                      <p>{transaction.amount}</p>
                      <p>Ref:{transaction.reference}</p>
                    </div>
                  </TableDataCell>
                  <TableDataCell>
                    <div>
                      <p>
                        {dayjs(transaction.transactionDate).format(
                          "DD-MM-YYYY"
                        )}
                      </p>
                      <p>{transaction.type}</p>
                    </div>
                  </TableDataCell>
                  <TableDataCell>
                    <span
                      className={`flex items-center justify-center w-max py-0 px-2 text-white ${
                        transaction.status === "pending"
                          ? "bg-slate-500/50"
                          : "bg-destructive"
                      } cursor-pointer rounded-xl`}
                      onClick={() =>
                        navigate(`/transactions/${transaction._id}`, {
                          state: { transaction, payee },
                        })
                      }
                    >
                      {transaction.status}
                    </span>
                  </TableDataCell>
                </TableDataRow>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TableHeaderRow = styled.tr`
  background-color: hsl(0deg 0% 80%);
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: 8px;
  text-transform: uppercase;
`;
const TableDataRow = styled.tr`
  border-bottom: 0.5px solid #ccc;
  &:nth-of-type(odd) {
    background-color: hsl(250deg 50% 99%);
  }
`;
const TableDataCell = styled.td`
  text-align: left;
  padding: 8px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;

const Counter = styled.p``;
export default Transaction;
