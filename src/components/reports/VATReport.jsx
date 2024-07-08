import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TbReceiptTax } from "react-icons/tb";
import PieGraph from "../charts/PieGraph";
import AreaGraph from "../charts/AreaChart";
import axios from "axios";
import * as XLSX from "xlsx";
import { Dropdown } from "rsuite";
import CustomDropDown from "../dropdown/DropDown";

const collectedCMSA = [
  {
    name: "Jan",
    cmsa: 2000,
  },
  {
    name: "Feb",
    cmsa: 3500,
  },
  {
    name: "Mar",
    cmsa: 1800,
  },
  {
    name: "Apr",
    cmsa: 2780,
  },
  {
    name: "May",
    cmsa: 1090,
  },
  {
    name: "Jun",
    cmsa: 2390,
  },
  {
    name: "Jul",
    cmsa: 3590,
  },
  {
    name: "Aug",
    cmsa: 1000,
  },
  {
    name: "Sep",
    cmsa: 3490,
  },
  {
    name: "Oct",
    cmsa: 500,
  },
  {
    name: "Nov",
    cmsa: 3090,
  },
  {
    name: "Dec",
    cmsa: 1000,
  },
];

const paidCMSA = [
  {
    name: "Jan",
    cmsa: 1800,
  },
  {
    name: "Feb",
    cmsa: 3000,
  },
  {
    name: "Mar",
    cmsa: 2000,
  },
  {
    name: "Apr",
    cmsa: 2780,
  },
  {
    name: "May",
    cmsa: 1890,
  },
  {
    name: "Jun",
    cmsa: 2390,
  },
  {
    name: "Jul",
    cmsa: 3590,
  },
  {
    name: "Aug",
    cmsa: 1000,
  },
  {
    name: "Sep",
    cmsa: 3490,
  },
  {
    name: "Oct",
    cmsa: 500,
  },
  {
    name: "Nov",
    cmsa: 3090,
  },
  {
    name: "Dec",
    cmsa: 1000,
  },
];
const VATReport = () => {
  const [data, setData] = useState([]);

  let formatter = new Intl.NumberFormat("en-US");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://api.alphafunds.co.tz/api/v1/vat"
      );
      setData(response.data);
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  console.log({ data });

  const totalVAT = data.reduce((acc, item) => acc + item.value, 0);
  // const totalPaid = data.reduce((acc, item) => acc + item.paid, 0);
  // const balance = totalVAT - totalPaid;

  console.log({ totalVAT });

  const exportToExcel = async () => {
    try {
      const response = await axios.get(
        "https://api.alphafunds.co.tz/api/v1/vat"
      );
      const data = response.data;

      //xlsx
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "VAT_Report.xlsx");
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
      `https://api.alphafunds.co.tz/api/v1/vat/montly/?month=${month}`
    );
    const data = response.data;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `VAT_Report_${monthName}.xlsx`);
  };

  return (
    <Wrapper>
      <Card>
        <Details>
          <Title>{formatter.format(totalVAT)}</Title>
          <Typography>Total VAT</Typography>
        </Details>
        <IconWrapper>
          <TbReceiptTax size={24} />
        </IconWrapper>
      </Card>
      <Card>
        <Details>
          <Title>2,863,267</Title>
          <Typography>Paid</Typography>
        </Details>
        <IconWrapper>
          <TbReceiptTax size={24} />
        </IconWrapper>
      </Card>
      <Card>
        <Details>
          <Title>2,863,267</Title>
          <Typography>Balance</Typography>
        </Details>
        <IconWrapper>
          <TbReceiptTax size={24} />
        </IconWrapper>
      </Card>
      <CollectionGraph>
        <Typography> CMSA Collections</Typography>
        <div style={{ height: "100%", width: "100%" }}>
          <AreaGraph data={collectedCMSA} dataKey="cmsa" />
        </div>
      </CollectionGraph>
      <PaidGraph>
        <Typography> CMSA Paid</Typography>
        <div style={{ height: "100%", width: "100%" }}>
          <AreaGraph data={paidCMSA} dataKey="cmsa" />
        </div>
      </PaidGraph>
      <Actions>
        <Button onClick={() => console.log("Export Range")}>
          Export Range
        </Button>
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
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 500px));
  grid-template-rows: repeat(11, 100px);
  grid-gap: 20px;
`;
const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333;
`;

const Details = styled.div`
  flex: 1;
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  width: 52px;
  border-radius: 50%;
  color: #007bff;
  background-color: #e6f2ff;
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 1.5;
`;
const Typography = styled.p`
  font-size: 14px;
  font-weight: normal;
  line-height: 1.5;
  color: #333;
`;

const CollectionGraph = styled.div`
  grid-column: 1 / 4;
  grid-row: 3 / 7;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const PaidGraph = styled.div`
  grid-column: 1 / 4;
  grid-row: 7 / 11;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Actions = styled.div`
  grid-column: 1 / 4;
  grid-row: 2 / 3;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: flex-end;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
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
  }
`;

export default VATReport;
