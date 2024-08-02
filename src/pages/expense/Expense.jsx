import React, { useEffect, useState } from "react";
import "./expense.css";
import Search from "../../components/search/Search";
import CheckBox from "../../components/checkbox/CheckBox";
import styled from "styled-components";
import Select from "../../components/select";
import { Button, ButtonGroup, ButtonToolbar } from "rsuite";
import ExpenseForm from "../../components/forms/expense/ExpenseForm";
import axios from "axios";
import * as XLSX from "xlsx";
import { Pagination, Stack } from "@mui/material";
import dayjs from "dayjs";

function Expense() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState("");
  const [expenses, setExpenses] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const itemsPerPage = 10; // Number of items to show per page

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const updatePayment = async (selected, status) => {
    for (let item in selected) {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/expenses/${selected[item]._id}`,
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
        }
      );
      const json = await response.json();
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
        const [expenseResponse, clientResponse] = await Promise.all([
          axios(`${import.meta.env.VITE_BASE_URL}/expenses`),
          axios(`${import.meta.env.VITE_BASE_URL}/customers`),
        ]);
        const data = expenseResponse.data;
        setExpenses(data?.data); // Assuming API returns { items: [...], totalPages: ... }
        setTotalPages(data.totalPages);
        setClients(clientResponse.data);
        setTotalDocuments(data.totalDocuments);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, [currentPage]);

  if (!clients) {
    return;
  }

  if (!expenses) {
    return <div>Loading...</div>;
  }

  const exportToExcel = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenses/all`
      );
      const data = response.data;

      //xlsx
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "Expenses.xlsx");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const filtered = expenses?.filter((expense) =>
    expense.payee?.name.toLowerCase().includes(query.toLowerCase())
  );
  const data = query ? filtered : expenses;
  return (
    <div className="expense">
      <div className="expense-header">
        <button
          style={{ backgroundColor: "var(--color-button)", color: "#fff" }}
          onClick={() => setOpen(true)}
        >
          New Expense
        </button>
        <div className="expense-header-right">
          <button
            style={{ backgroundColor: "var(--color-button)", color: "#fff" }}
            onClick={exportToExcel}
          >
            Export Excel
          </button>
        </div>
      </div>
      <div className="expense-actions">
        <Search setQuery={setQuery} />
        <div
          className="expense-actions_hiden"
          style={{ visibility: visible ? "visible" : "hidden" }}
        >
          <button
            style={{ backgroundColor: "var(--color-approve)", color: "#fff" }}
            onClick={() => updatePayment(selected, { status: "approved" })}
          >
            Approve
          </button>
          <button
            style={{
              backgroundColor: "var(--color-disapprove)",
              color: "#fff",
            }}
            onClick={() => updatePayment(selected, { status: "" })}
          >
            Disapprove
          </button>
          <button
            style={{ backgroundColor: "var(--color-reject)", color: "#fff" }}
          >
            Reject
          </button>
          <button
            style={{ backgroundColor: "var(--color-button)", color: "#fff" }}
          >
            Export(excel)
          </button>
        </div>
      </div>
      <TableWrapper>
        <Table style={{ width: "100%" }}>
          <thead>
            <TableHeaderRow>
              <TableHeaderCell style={{ width: 70, textAlign: "left" }}>
                <CheckBox
                  name="all"
                  value={selected.length === expenses.length}
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
            {data.map((expense) => {
              const payee = clients?.filter(
                (client) => client.id === expense.client_id
              )[0];
              return (
                <TableDataRow key={expense._id}>
                  <TableDataCell>
                    <CheckBox
                      name={expense}
                      value={selected.includes(expense)}
                      visible={visible}
                      setVisible={setVisible}
                      updateValue={handleSelect}
                    />
                  </TableDataCell>
                  <TableDataCell>{expense.uid}</TableDataCell>
                  <TableDataCell>{payee?.name}</TableDataCell>
                  <TableDataCell>{expense.description}</TableDataCell>
                  <TableDataCell>{expense.amount}</TableDataCell>
                  <TableDataCell>
                    {dayjs(expense.transaction_date).format("DD-MM-YYYY")}
                  </TableDataCell>
                  <TableDataCell>{expense.status}</TableDataCell>
                </TableDataRow>
              );
            })}
          </tbody>
        </Table>
        <PaginationWrapper>
          <Counter>{totalDocuments} total orders</Counter>
          <Stack spacing={2}>
            {/* <Pagination count={10} shape="rounded" /> */}
            <Pagination
              count={totalPages}
              variant="outlined"
              shape="rounded"
              color="primary"
              page={currentPage}
              onChange={handleChange}
            />
          </Stack>
        </PaginationWrapper>
      </TableWrapper>

      <ExpenseForm open={open} setOpen={setOpen} />
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

export default Expense;
