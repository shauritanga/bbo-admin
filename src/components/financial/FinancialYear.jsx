import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Select from "../select";
import FinancialYearForm from "../forms/financial/FinancialYearForm";
import {
  fetchFinancialYears,
  deleteFinancialYear,
  setCounter,
  setQuerry,
} from "../../reducers/financialYearSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { ButtonToolbar, Notification, toaster, Button } from "rsuite";

const FinancialYear = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { financialYears, status, error, filters } = useSelector(
    (state) => state.financialYears
  );

  useEffect(() => {
    dispatch(fetchFinancialYears());
  }, [dispatch]);

  const filteredFinancialYears = financialYears
    .slice(0, filters.counter)
    .filter((year) => {
      const matchesQuery =
        !filters.query ||
        year.name.toLowerCase().includes(filters.query.toLowerCase());

      return matchesQuery;
    });

  const handleAsk = (id) => {
    toaster.push(
      <Notification type="warning" header="warning" content="Are you sure?">
        <p>Are you sure you want to delete this year?</p>
        <hr />
        <ButtonToolbar>
          <Button appearance="primary" onClick={() => handleDelete(id)}>
            Ok
          </Button>
          <Button appearance="default" onClick={() => toaster.remove()}>
            Cancel
          </Button>
        </ButtonToolbar>
      </Notification>
    );
  };

  const handleDelete = (id) => {
    dispatch(deleteFinancialYear(id));
    toaster.remove();
  };

  if (status === "loading") {
    console.log("imekamilika");
    return <div>Loading...</div>;
  } else if (status === "failed") {
    console.log(error);
    return <div>Error: {error}</div>;
  } else if (status === "succeeded") {
    return (
      <Wrapper>
        <h5>Financial Years</h5>
        <Actions>
          <Select
            width={60}
            value={filters.counter}
            onChange={(e) => dispatch(setCounter(e.target.value))}
            options={[5, 10, 15]}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </Select>
          <TextInput
            value={filters.query}
            onChange={(e) => dispatch(setQuerry(e.target.value))}
            type="text"
            placeholder="Search"
          />
          <Button onClick={() => setOpen(true)}>Add New Year</Button>
        </Actions>
        <TableWrapper>
          <Table>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>name</TableHeaderCell>
                <TableHeaderCell>starts</TableHeaderCell>
                <TableHeaderCell>ends</TableHeaderCell>
                <TableHeaderCell>status</TableHeaderCell>
                <TableHeaderCell>actions</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {filteredFinancialYears.length === 0 ? (
                <TableDataRow>
                  <TableDataCell
                    style={{ textAlign: "center", padding: "20px" }}
                    colSpan={8}
                  >
                    No financial years found
                  </TableDataCell>
                </TableDataRow>
              ) : (
                filteredFinancialYears?.map((year) => (
                  <TableDataRow>
                    <TableDataCell>{year.name}</TableDataCell>
                    <TableDataCell>
                      {dayjs(year.startDate).format("DD-MM-YYYY")}
                    </TableDataCell>
                    <TableDataCell>
                      {dayjs(year.endDate).format("DD-MM-YYYY")}
                    </TableDataCell>
                    <TableDataCell>{year.status}</TableDataCell>
                    <TableDataCell>
                      <button onClick={() => setOpen(true)}>Edit</button>
                      <button onClick={() => handleAsk(year._id)}>
                        Delete
                      </button>
                    </TableDataCell>
                  </TableDataRow>
                ))
              )}
            </tbody>
          </Table>
        </TableWrapper>
        <FinancialYearForm open={open} setOpen={setOpen} />
      </Wrapper>
    );
  }
};

const Wrapper = styled.div`
  background-color: hsl(0deg 0% 100%);
`;
const Actions = styled.div`
  display: flex;
  gap: 20px;
  margin: 30px 0;
`;
const TextInput = styled.input`
  padding: 8px 16px;
  border: 1px solid hsl(0deg 0% 70%);
  border-radius: 7px;
  width: 340px;
  margin-right: auto;
`;
// const Button = styled.button`
//   padding: 10px 20px;
//   border-radius: 7px;
//   color: #fff;
//   background-color: hsl(243deg 50% 21%);
// `;

const TableWrapper = styled.div``;
const Table = styled.table`
  width: 100%;
`;
const TableHeaderRow = styled.tr`
  background-color: hsl(0deg 0% 60%);
`;
const TableHeaderCell = styled.th`
  text-transform: uppercase;
  text-align: left;
  padding: 10px;
`;
const TableDataRow = styled.tr``;
const TableDataCell = styled.td`
  padding: 10px;
  &:last-of-type {
    display: flex;
    gap: 20px;
  }
  > button {
    background-color: transparent;
    padding: 10px 20px;
  }
  > button:first-of-type {
    color: hsl(243deg 50% 21%);
  }
  > button:last-of-type {
    color: red;
  }
`;

export default FinancialYear;
