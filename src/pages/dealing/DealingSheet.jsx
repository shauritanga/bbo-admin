import React, { useState } from "react";
import { DateRangePicker } from "rsuite";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import { RotatingLines } from "react-loader-spinner";
import { axiosInstance } from "@/utils/axiosConfig";
import { DealingDataTable } from "@/components/dealing/table";

const DealingSheet = () => {
  const [dealings, setDealings] = useState([]);
  const [sort, setSort] = React.useState("all");

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchDealingOrder = async () => {
      try {
        const response = await axiosInstance.get("/orders/dealing");
        setDealings(response.data);
      } catch (error) {}
    };
    fetchDealingOrder();
  }, []);

  return (
    <Wrapper>
      <DealingDataTable orders={dealings} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #ccc;
`;
const Sheet = styled.div`
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  background-color: #fff;
`;
const SheetHeader = styled.div``;
const SheetBody = styled.div`
  height: 500px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const TableHead = styled.thead`
  background-color: #f2f2f2;
`;
const TableHeader = styled.th`
  text-align: left;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;
const TableBody = styled.tbody``;
const TableRow = styled.tr``;
const TableData = styled.td`
  padding: 8px;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #ccc;
`;
const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 20px;
  font-size: 16px;
  cursor: pointer;
`;
const TextInput = styled.input`
  width: 300px;
  padding: 10px;
  margin-right: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

export default DealingSheet;
