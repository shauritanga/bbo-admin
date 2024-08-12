import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useData } from "../../context/userContext";
import { Pagination, Stack } from "@mui/material";

const Statement = ({ id, orders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { statements } = useData();

  const itemsPerPage = 10;

  console.log({ statements });

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  let formatter = new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/orders/client/${id}`),
        ]);

        setOrders(orderResponse.data);
      } catch (error) {}
    };
    fetchData();
  }, []);

  const displayedStatements = statements?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  console.log(displayedStatements);

  const totalPages = Math.ceil(displayedStatements?.length / itemsPerPage);

  const currentData = displayedStatements?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        {currentData?.map((transaction) => {
          return (
            <TableDataRow key={transaction._id}>
              <TableDataCell>
                {dayjs(transaction.date).format("DD-MM-YYYY")}
              </TableDataCell>
              <TableDataCell>{transaction.type}</TableDataCell>
              <TableDataCell>{transaction.reference}</TableDataCell>
              <TableDataCell>{transaction.particulars}</TableDataCell>
              <TableDataCell>{transaction.quantity}</TableDataCell>
              <TableDataCell>{transaction.price}</TableDataCell>
              <TableDataCell>{transaction.debit}</TableDataCell>
              <TableDataCell>{transaction.credit}</TableDataCell>
              <TableDataCell>
                {formatter.format(transaction.balance)}
              </TableDataCell>
            </TableDataRow>
          );
        })}
      </Table>
      <Spacer></Spacer>
      <PaginationWrapper>
        <Counter>{displayedStatements?.length} total orders</Counter>
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: 7px;
  min-height: 600px;
  padding: 20px;
`;

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
