import React from "react";
import styled from "styled-components";
import { TbReceiptTax } from "react-icons/tb";
import PieGraph from "../charts/PieGraph";
import AreaGraph from "../charts/AreaChart";

const collectedCSDR = [
  {
    name: "Jan",
    csdr: 2000,
  },
  {
    name: "Feb",
    csdr: 3500,
  },
  {
    name: "Mar",
    csdr: 1800,
  },
  {
    name: "Apr",
    csdr: 2780,
  },
  {
    name: "May",
    csdr: 1090,
  },
  {
    name: "Jun",
    csdr: 2390,
  },
  {
    name: "Jul",
    csdr: 3590,
  },
  {
    name: "Aug",
    csdr: 1000,
  },
  {
    name: "Sep",
    csdr: 3490,
  },
  {
    name: "Oct",
    csdr: 500,
  },
  {
    name: "Nov",
    csdr: 3090,
  },
  {
    name: "Dec",
    csdr: 1000,
  },
];

const paidCSDR = [
  {
    name: "Jan",
    csdr: 1800,
  },
  {
    name: "Feb",
    csdr: 3000,
  },
  {
    name: "Mar",
    csdr: 2000,
  },
  {
    name: "Apr",
    csdr: 2780,
  },
  {
    name: "May",
    csdr: 1890,
  },
  {
    name: "Jun",
    csdr: 2390,
  },
  {
    name: "Jul",
    csdr: 3590,
  },
  {
    name: "Aug",
    csdr: 1000,
  },
  {
    name: "Sep",
    csdr: 3490,
  },
  {
    name: "Oct",
    csdr: 500,
  },
  {
    name: "Nov",
    csdr: 3090,
  },
  {
    name: "Dec",
    csdr: 1000,
  },
];
const CSDRReport = () => {
  return (
    <Wrapper>
      <Card>
        <Details>
          <Title>2,863,267</Title>
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
        <Typography> CSDR Collections</Typography>
        <div style={{ height: "100%", width: "100%" }}>
          <AreaGraph data={collectedCSDR} dataKey="csdr" />
        </div>
      </CollectionGraph>
      <PaidGraph>
        <Typography> CSDR Paid</Typography>
        <div style={{ height: "100%", width: "100%" }}>
          <AreaGraph data={paidCSDR} dataKey="csdr" />
        </div>
      </PaidGraph>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 500px));
  grid-template-rows: repeat(10, 100px);
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
  grid-row: 2 / 6;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const PaidGraph = styled.div`
  grid-column: 1 / 4;
  grid-row: 6 / 10;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default CSDRReport;
