import React, { useEffect, useState } from "react";
import "./receipt.css";
import Search from "../../components/search/Search";
import dayjs from "dayjs";
import CheckBox from "../../components/checkbox/CheckBox";
import ReceiptForm from "../../components/forms/receipt/ReceiptForm";
import styled from "styled-components";
import { Button, ButtonGroup, ButtonToolbar } from "rsuite";
import axios from "axios";
import * as XLSX from "xlsx";
import { Pagination, Stack } from "@mui/material";

function Receipt() {
  const [checked, setChecked] = useState(false);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState("");
  const [receipts, setReceipts] = useState(null);
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
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/receipts/${selected[item]._id}`,
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

  const exportToExcel = async () => {
    try {
      // const response = await axios.get(
      //   `${import.meta.env.VITE_BASE_URL}/receipts/all`
      // );
      const data = receipts;

      //xlsx
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "Receipts.xlsx");
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
      setSelected(receipts);
    } else {
      setSelected([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/receipts/?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = await response.json();
        setReceipts(data.data); // Assuming API returns { items: [...], totalPages: ... }
        setTotalPages(data.totalPages);
        setTotalDocuments(data.totalDocuments);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const customersResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/customers`
        );
        if (!customersResponse.ok) throw new Error("Error fetching customers");

        const customersData = await customersResponse.json();
        setClients(customersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!clients) {
    return;
  }

  if (!receipts) {
    return <div>Loading...</div>;
  }

  const filtered = receipts.filter((expense) => {
    const payee = clients.filter((client) => client.id === expense.client_id);
    return payee[0]?.name.toLowerCase().includes(query.toLowerCase());
  });
  const data = query ? filtered : receipts;
  return (
    <div className="receipt">
      <div className="receipt-header">
        <button
          style={{ backgroundColor: "var(--color-button)", color: "#fff" }}
          onClick={() => setOpenForm(true)}
        >
          New Receipt
        </button>
        <div className="receipt-header-right">
          <button
            style={{ backgroundColor: "var(--color-button)", color: "#fff" }}
            onClick={exportToExcel}
          >
            Export Excel
          </button>
        </div>
      </div>
      <div className="receipt-actions">
        <Search setQuery={setQuery} />
        <div
          className="receipt-actions_hiden"
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
              <TableHeaderCell style={{ width: "50px" }}>
                <CheckBox
                  name="all"
                  value={selected.length === receipts.length}
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
            {data.length === 0 ? (
              <TableDataRow>
                <TableDataCell
                  style={{ textAlign: "center", padding: "10px" }}
                  colSpan={7}
                >
                  No Records found
                </TableDataCell>
              </TableDataRow>
            ) : (
              data?.map((expense) => {
                const payee = clients.filter(
                  (client) => client.id === expense.client_id
                );
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
                    <TableDataCell>{payee[0]?.name}</TableDataCell>
                    <TableDataCell>{expense.description}</TableDataCell>
                    <TableDataCell>{expense.amount}</TableDataCell>
                    <TableDataCell>
                      {dayjs(expense.transaction_date).format("DD-MM-YYYY")}
                    </TableDataCell>
                    <TableDataCell>{expense.status}</TableDataCell>
                  </TableDataRow>
                );
              })
            )}
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
              page={currentPage}
              onChange={handleChange}
            />
          </Stack>
        </PaginationWrapper>
      </TableWrapper>
      <ReceiptForm open={openForm} setOpen={setOpenForm} />
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
  margin-top: auto;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;
const Counter = styled.p``;
const Pages = styled.div``;
export default Receipt;
