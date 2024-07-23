import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./transaction.css";
import CheckBox from "../../components/checkbox/CheckBox";
import Select from "../../components/select";
import { DateRangePicker, toaster, Notification } from "rsuite";
import styled from "styled-components";
import dayjs from "dayjs";
import { Pagination, Stack } from "@mui/material";

function Transaction() {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState("");
  const [customer, setCustomer] = useState("");
  const [transactions, setTransactions] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const itemsPerPage = 10; // Number of items to show per page

  const navigate = useNavigate();

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
      for (let item in selected) {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/transactions/${selected[item]._id}`,
          {
            mode: "cors",
            method: "PATCH",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(status),
          }
        );
        const json = await response.json();
      }
      toaster.push(
        <Notification type="success" header="Success">
          Update successifully
        </Notification>,
        {
          duration: 5000,
          placement: "topCenter",
        }
      );
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error">
          {error.message}
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
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/transactions/?page=${currentPage}&limit=${itemsPerPage}`
        );
        const data = await response.json();
        setTransactions(data.data); // Assuming API returns { items: [...], totalPages: ... }
        setTotalPages(data.totalPages);
        setTotalDocuments(data.totalDocuments);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/customers`, {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.log(error));
  }, []);

  if (!clients || !transactions) {
    return <div>Loading...</div>;
  }

  const clientOptions = clients?.map((client) => {
    return { lable: client.name, value: client.name };
  });

  const filtered = transactions?.filter((expense) =>
    expense.payee?.name.toLowerCase().includes(query.toLowerCase())
  );
  const data = query ? filtered : transactions;
  return (
    <div className="transaction">
      <div className="transaction-actions">
        <Select
          width={340}
          value={customer}
          onChange={(event) => setCustomer(event.target.value)}
        >
          <option value="" disabled>
            Select Customer
          </option>
          {clients?.map((customer) => (
            <option key={customer._id} value={customer.name}>
              {customer.name}
            </option>
          ))}
        </Select>
        <DateRangePicker
          format="dd-MM-yyyy"
          style={{
            border: "1px solid hsl(0deg 0% 80%)",
            borderRadius: "7px",
          }}
          placeholder="Select Date Range"
        />
        <FilterButton>Filter</FilterButton>
        <div
          className="transaction-actions_hiden"
          style={{ visibility: visible ? "visible" : "hidden" }}
        >
          <button
            style={{ backgroundColor: "var(--color-approve)", color: "#fff" }}
            onClick={() => updateTransaction(selected, { status: "approved" })}
          >
            Approve
          </button>
          <button
            style={{
              backgroundColor: "var(--color-disapprove)",
              color: "#fff",
            }}
            onClick={() =>
              updateTransaction(selected, { status: "disapproved" })
            }
          >
            Disapprove
          </button>
          <button
            style={{ backgroundColor: "var(--color-reject)", color: "#fff" }}
            onClick={() => updateTransaction(selected, { status: "rejected" })}
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
            {data.map((transaction) => {
              const payee = clients.filter(
                (client) => client.id === transaction.client_id
              );
              const payMethod = clients.filter(
                (client) => client.id === transaction.client_id
              );
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
                  <TableDataCell>{payee[0]?.name}</TableDataCell>
                  <TableDataCell>{transaction.description}</TableDataCell>
                  <TableDataCell>
                    <div>
                      <p>{transaction.amount}</p>
                      <p>Ref:{transaction.reference}</p>
                    </div>
                  </TableDataCell>
                  <TableDataCell>
                    <div>
                      <p>{dayjs(transaction.date).format("DD-MM-YYYY")}</p>
                      <p>{transaction.type}</p>
                    </div>
                  </TableDataCell>
                  <TableDataCell>
                    <span
                      style={{
                        backgroundColor:
                          transaction.status === "approved"
                            ? "var(--color-approve)"
                            : transaction.status === "disapproved"
                            ? "var(--color-disapprove)"
                            : "none",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        color: "black",
                        cursor: "pointer",
                      }}
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
      </div>
    </div>
  );
}
const FilterButton = styled.button`
  padding: 8px 20px;
  color: hsl(0deg 0% 100%);
  border-radius: 5px;
  width: 200px;
  margin-right: auto;
  background-color: hsl(243deg 50% 21%);
`;

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
