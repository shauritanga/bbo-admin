import React from "react";
import styled from "styled-components";
import { TbReceiptTax } from "react-icons/tb";
import PieGraph from "../charts/PieGraph";
import AreaGraph from "../charts/AreaChart";

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
const CMSAReport = () => {
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

export default CMSAReport;
