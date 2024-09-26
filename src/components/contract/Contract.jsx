import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { useData } from "../../context/userContext";
import { Pagination, Stack } from "@mui/material";
import ContractNoteDownload from "../pdf/PrintContractPDF";
import { ContractDataTable } from "./table";

const Contract = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { executions, transactions } = useData();

  return <ContractDataTable executions={executions} />;
};

export default Contract;
