import { LineChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PieGraph from "../charts/PieGraph";
import axios from "axios";
import * as XLSX from "xlsx";
import { Dropdown } from "rsuite";
import { ordersByMonth } from "../../utils/totalordersByMonth";

const ExpensesReport = () => {
  const [expenses, setExpenses] = useState(null);

  useEffect(() => {
    const getExpenses = async () => {
      const response = await axios.get(
        "https://api.alphafunds.co.tz/api/v1/expenses/all"
      );
      if (response.statusText === "OK") {
        setExpenses(response.data);
      } else {
        console.log("Failed to fetch expenses");
      }
    };
    getExpenses();
  }, []);
  if (expenses === null) {
    return <div>Loading...</div>;
  }

  console.log(expenses);
  const expensesByMonth = ordersByMonth(expenses);

  const getKeys = () => {
    const keys = [];
    const values = [];
    for (let key in expensesByMonth) {
      keys.push(expensesByMonth[key].name);
      values.push(expensesByMonth[key].total);
    }
    return {
      keys,
      values,
    };
  };

  const { keys, values } = getKeys();

  const y = (keys) => {
    const yValues = [];
    for (let i = 0; i <= 11; i++) {
      if (keys[i] !== undefined) {
        yValues.push(keys[i]);
      } else {
        yValues.push(0);
      }
    }
    return yValues;
  };
  const x = (values) => {
    const xValues = [];
    for (let i = 0; i <= 11; i++) {
      if (values[i] !== undefined) {
        xValues.push(values[i]);
      } else {
        xValues.push(0);
      }
    }
    return xValues;
  };

  //XLSX
  const exportToExcel = async () => {
    try {
      const response = await axios.get(
        "https://api.alphafunds.co.tz/api/v1/expenses/all"
      );
      const data = response.data;
      console.log(data);

      //xlsx
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "Expense_Report.xlsx");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const exportMonthlyVAT = async (monthName) => {
    let month = null;
    switch (monthName) {
      case "January":
        month = 0;
        break;
      case "February":
        month = 1;
        break;
      case "March":
        month = 2;
        break;
      case "April":
        month = 3;
        break;
      case "May":
        month = 4;
        break;
      case "June":
        month = 5;
        break;
      case "July":
        month = 6;
        break;
      case "August":
        month = 7;
        break;
      case "September":
        month = 8;
        break;
      case "October":
        month = 9;
        break;
      case "November":
        month = 10;
        break;
      case "December":
        month = 11;
        break;
    }
    const response = await axios.get(
      `http://localhost:5001/api/expenses/monthly/?month=${month}`
    );
    const data = response.data;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `Expense_Report_${monthName}.xlsx`);
  };

  return (
    <Wrapper>
      <GraphWrapper>
        <LineChart
          series={[
            {
              data: x(values),
            },
          ]}
          xAxis={[
            {
              scaleType: "band",
              data: y(keys),
            },
          ]}
          height={400}
          grid={{ vertical: true, horizontal: true }}
        />
      </GraphWrapper>
      <Earning>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h4>Expenses</h4>
          <p>This Month</p>
          <p>$563,445</p>
          <p style={{ color: "#808080" }}>80% less eraning than last month</p>
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <PieGraph />
        </div>
      </Earning>
      <Quarter>
        <div style={{}}>
          <h5>Quarters</h5>
          <p>45,345,876</p>
        </div>
        <div
          style={{ height: "90px", backgroundColor: "red", width: "100%" }}
        ></div>
      </Quarter>
      <Actions>
        <Button>Export Range</Button>
        <Button onClick={exportToExcel}>Export All</Button>
        <StyledDropdown title="Export Monthly">
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            January
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            February
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            March
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            April
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            May
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            June
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            July
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            August
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            September
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            October
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            November
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(value) => exportMonthlyVAT(value.target.innerText)}
          >
            December
          </Dropdown.Item>
        </StyledDropdown>
      </Actions>
      <TableWrapper>
        <Table>
          <thead>
            <TableHeaderRow>
              <TableHeaderCell>Jan</TableHeaderCell>
              <TableHeaderCell>Feb</TableHeaderCell>
              <TableHeaderCell>Mar</TableHeaderCell>
              <TableHeaderCell>Apr</TableHeaderCell>
              <TableHeaderCell>May</TableHeaderCell>
              <TableHeaderCell>Jun</TableHeaderCell>
              <TableHeaderCell>Jul</TableHeaderCell>
              <TableHeaderCell>Aug</TableHeaderCell>
              <TableHeaderCell>Sep</TableHeaderCell>
              <TableHeaderCell>Oct</TableHeaderCell>
              <TableHeaderCell>Nov</TableHeaderCell>
              <TableHeaderCell>Dec</TableHeaderCell>
            </TableHeaderRow>
          </thead>
          <tbody>
            {["1"].map((item, index) => {
              return (
                <TableBodyRow key={index}>
                  <TableBodyCell>34,786,900</TableBodyCell>
                  <TableBodyCell>78,345,900</TableBodyCell>
                  <TableBodyCell>12,345,900</TableBodyCell>
                  <TableBodyCell>67,345,900</TableBodyCell>
                  <TableBodyCell>67,345,900</TableBodyCell>
                  <TableBodyCell>98,345,900</TableBodyCell>
                  <TableBodyCell>12,345,900</TableBodyCell>
                  <TableBodyCell>67,345,900</TableBodyCell>
                  <TableBodyCell>23,345,900</TableBodyCell>
                  <TableBodyCell>12,345,900</TableBodyCell>
                  <TableBodyCell>67,345,900</TableBodyCell>
                  <TableBodyCell>23,345,900</TableBodyCell>
                </TableBodyRow>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 500px));
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 20px;
`;
const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #6662b2;
  }
  &:first-of-type {
    margin-left: auto;
  }
`;
const GraphWrapper = styled.div`
  grid-column: 1/3;
  grid-row: 2/6;
  background-color: #fff;
`;
const TableWrapper = styled.div`
  grid-column: 1/4;
  grid-row: 6/7;
  background-color: #fff;
`;
const Earning = styled.div`
  grid-column: 3/4;
  grid-row: 2/4;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-radius: 5px;
  padding: 0 20px;
`;
const Quarter = styled.div`
  grid-column: 3/4;
  grid-row: 4/6;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
`;
const Actions = styled.div`
  grid-column: 1/4;
  grid-row: 1/2;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 50px;
  border-radius: 5px;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
`;
const TableHeaderRow = styled.tr`
  background-color: #f2f2f2;
`;
const TableHeaderCell = styled.th`
  text-align: left;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px;
`;
const TableBodyRow = styled.tr``;
const TableBodyCell = styled.td`
  text-align: left;
  font-size: 12px;
  padding: 10px;
`;

const StyledDropdown = styled(Dropdown)`
  & .rs-dropdown-toggle {
    width: 135px;
  }
  & .rs-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    &:hover {
      background-color: #6662b2;
    }
  }
`;

export default ExpensesReport;
