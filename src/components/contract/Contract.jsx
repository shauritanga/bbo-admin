import React, { useEffect } from "react";
import styled from "styled-components";
import { fetchExecutions } from "../../reducers/executionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

const Contract = ({ id }) => {
  const { executions, status, error } = useSelector(
    (state) => state.executions
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchExecutions(id));
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading ...</div>;
  }
  if (status === "failed") {
    return <div>{error}</div>;
  }

  console.log(executions);
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
        {executions.length === 0 ? (
          <TableDataRow>
            <TableDataCell colSpan={6}>No data found</TableDataCell>
          </TableDataRow>
        ) : (
          executions?.map((execution) => (
            <TableDataRow key={execution._id}>
              <TableDataCell>
                {dayjs(execution.date).format("DD-MM-YYYY")}
              </TableDataCell>
              <TableDataCell>{execution.slip}</TableDataCell>
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

export default Contract;
