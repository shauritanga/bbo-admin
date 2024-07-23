import React, { useEffect, useState } from "react";
import {
  ChartContainer,
  LineChart,
  LinePlot,
  MarkPlot,
  ResponsiveChartContainer,
  lineElementClasses,
  markElementClasses,
} from "@mui/x-charts";
import styled from "styled-components";
import MyPieChart from "../pie/trial";
import { Dropdown } from "rsuite";
import axios from "axios";
import * as XLSX from "xlsx";

const PaymentReport = () => {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/payments/all`
      );
      setReceipts(response.data);
    };
    fetchReceipts();
  }, []);

  if (receipts.length === 0) {
    return <div>Loading...</div>;
  }

  //XLSX
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
      XLSX.writeFile(workbook, "Payment_Report.xlsx");
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
      `${import.meta.env.VITE_BASE_URL}/payments/monthly/?month=${month}`
    );
    const data = response.data;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `Payment_Report_${monthName}.xlsx`);
  };
  return (
    <Wrapper>
      <GraphWrapper>
        <LineChart
          series={[
            {
              data: [
                2400, 1398, 9800, 3908, 4800, 3800, 4300, 3800, 4300, 3800,
                4300, 3800,
              ],
            },
          ]}
          xAxis={[
            {
              scaleType: "band",
              data: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
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
            flex: 1,
          }}
        >
          <h4>Earnings</h4>
          <p>This Month</p>
          <p>$563,445</p>
          <p style={{ color: "#808080" }}>80% less eraning than last month</p>
        </div>
        <div style={{ width: "180px", height: "180px" }}>
          <MyPieChart />
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

export default PaymentReport;
