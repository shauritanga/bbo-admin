import React, { useEffect, useState } from "react";
import "./payment.css";
import Search from "../../components/search/Search";
import dayjs from "dayjs";
import CheckBox from "../../components/checkbox/CheckBox";
import styled from "styled-components";
import Select from "../../components/select";
import PaymentForm from "../../components/forms/payment/PaymentForm";
import { Button, ButtonGroup, ButtonToolbar } from "rsuite";
import axios from "axios";
import * as XLSX from "xlsx";

function Payment() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState("");
  const [payments, setPayments] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const itemsPerPage = 10; // Number of items to show per page

  const updatePayment = async (selected, status) => {
    for (let item in selected) {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/payments/${selected[item]._id}`,
        {
          mode: "cors",
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
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/payments/all`
      );
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
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/payments/?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = await response.json();
        setPayments(data.data); // Assuming API returns { items: [...], totalPages: ... }
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
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!clients) {
    return <div>Loading</div>;
  }

  if (!payments) {
    return <div>Loading...</div>;
  }
  console.log(payments);

  const filtered = payments?.filter((payment) =>
    payment.payee?.name.toLowerCase().includes(query.toLowerCase())
  );
  const data = query ? filtered : payments;
  return (
    <div className="payment">
      <div className="payment-header">
        <button
          style={{ backgroundColor: "var(--color-button)", color: "#fff" }}
          onClick={() => setOpenForm(true)}
        >
          New Payment
        </button>
        <div className="payment-header-right">
          <button
            style={{ backgroundColor: "var(--color-button)", color: "#fff" }}
            onClick={exportToExcel}
          >
            Export Excel
          </button>
        </div>
      </div>
      <div className="payment-actions">
        <Search setQuery={setQuery} />
        <div
          className="payment-actions_hiden"
          style={{
            visibility: visible || selected.length !== 0 ? "visible" : "hidden",
          }}
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
                  value={selected.length === payments.length}
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
            {Array.isArray(data) &&
              data.map((expense, index) => (
                <TableDataRow key={expense._id}>
                  <TableDataCell style={{ width: "50px" }}>
                    <CheckBox
                      name={expense}
                      value={selected.includes(expense)}
                      visible={visible}
                      setVisible={setVisible}
                      updateValue={handleSelect}
                    />
                  </TableDataCell>
                  <TableDataCell>{expense.paymentId}</TableDataCell>
                  <TableDataCell>{expense.payee?.name}</TableDataCell>
                  <TableDataCell>{expense.description}</TableDataCell>
                  <TableDataCell>{expense.amount}</TableDataCell>
                  <TableDataCell>
                    {dayjs(expense.date).format("DD-MM-YYYY")}
                  </TableDataCell>
                  <TableDataCell>{expense.status}</TableDataCell>
                </TableDataRow>
              ))}
          </tbody>
        </Table>
        <Pagination>
          <Counter>{totalDocuments} total orders</Counter>
          <ButtonToolbar>
            <Button
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)
              }
              style={{ color: "hsl(243deg, 50%, 50%)" }}
            >
              Prev
            </Button>
            <ButtonGroup>
              {Array.from(Array(totalPages).keys())
                .map((x) => x + 1)
                .map((page) => (
                  <Button onClick={() => setCurrentPage(page)}>{page}</Button>
                ))}
            </ButtonGroup>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{ color: "hsl(243deg, 50%, 50%)" }}
            >
              Next
            </Button>
          </ButtonToolbar>
        </Pagination>
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
const Pagination = styled.div`
  display: flex;
  margin-top: auto;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;
const Counter = styled.p``;
const Pages = styled.div``;
export default Payment;
