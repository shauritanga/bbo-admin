import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { useData } from "../../context/userContext";
import { Pagination, Stack } from "@mui/material";

const Contract = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { executions } = useData();

  const itemsPerPage = 10;

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(executions?.length / itemsPerPage);

  const currentData = executions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Wrapper>
      <p>Contract Note</p>
      <Table>
        <TableHeaderRow>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Slip No</TableHeaderCell>
          <TableHeaderCell>Price</TableHeaderCell>
          <TableHeaderCell>executed</TableHeaderCell>
          <TableHeaderCell>amount</TableHeaderCell>
          <TableHeaderCell>Action</TableHeaderCell>
        </TableHeaderRow>
        {currentData?.length === 0 ? (
          <TableDataRow>
            <TableDataCell colSpan={6}>No data found</TableDataCell>
          </TableDataRow>
        ) : (
          currentData?.map((execution) => (
            <TableDataRow key={execution._id}>
              <TableDataCell>
                {dayjs(execution.date).format("DD-MM-YYYY")}
              </TableDataCell>
              <TableDataCell>{execution.slip_no}</TableDataCell>
              <TableDataCell>{execution.price}</TableDataCell>
              <TableDataCell>{execution.executed}</TableDataCell>
              <TableDataCell>{execution.amount}</TableDataCell>
              <TableDataCell style={{ display: "flex", gap: "10px" }}>
                <span
                  style={{
                    color: "green",
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    console.log(execution);
                    const url = `/contract?execution=${JSON.stringify(
                      execution
                    )}`;
                    const title = "Contract";
                    return window.open(url, title);
                  }}
                >
                  PDF
                </span>
                <span
                  style={{
                    color: "green",
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  onClick={() =>
                    navigate(`/dealing/${execution._id}`, {
                      state: execution,
                    })
                  }
                >
                  view
                </span>
              </TableDataCell>
            </TableDataRow>
          ))
        )}
      </Table>
      <Spacer></Spacer>
      <PaginationWrapper>
        <Counter>{executions?.length} total orders</Counter>
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

export default Contract;
