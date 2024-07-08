import React, { useEffect, useState } from "react";
import CreateReportForm from "../../components/forms/reports/CreateReportForm";
import { fetchReports, setTitle } from "../../reducers/reportSlice";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import dayjs from "dayjs";

const MarketReports = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const { reports, status, error, filters } = useSelector(
    (state) => state.reports
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error: {error}</div>;
  }

  const filteredReports = reports.filter(
    (report) =>
      !filters.title ||
      report.title.toLowerCase().includes(filters.title.toLowerCase())
  );

  return (
    <Wrapper>
      <TableWrapper>
        <Actions>
          <TextInput
            value={filters.title}
            type="text"
            onChange={(e) => dispatch(setTitle(e.target.value))}
            placeholder="Saerch"
          />
          <Button onClick={() => setOpenCreateForm(true)}>
            Create New Report
          </Button>
        </Actions>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Id</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Title</TableHeader>
              <TableHeader>Recipients</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow>
                <TableData>{report.orderId}</TableData>
                <TableData>{dayjs(report.date).format("DD-MM-YYYY")}</TableData>
                <TableData>{report.title}</TableData>
                <TableData>{report.recipients}</TableData>
                <TableData>{report.status}</TableData>
                <TableData></TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
      <CreateReportForm open={openCreateForm} setOpen={setOpenCreateForm} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Actions = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
`;
const TableWrapper = styled.div`
  background-color: #fff;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const TableHead = styled.thead`
  background-color: #f2f2f2;
`;
const TableBody = styled.tbody``;
const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;
const TableData = styled.td`
  padding: 8px;
  text-align: left;
`;
const TableHeader = styled.th`
  padding: 8px;
  text-align: left;
  text-transform: uppercase;
  background-color: #f2f2f2;
`;

const TextInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 10px;
  width: 300px;
  font-size: 16px;
  outline: none;
`;
const Button = styled.button`
  padding: 6px 12px;
  background-color: hsl(243, 50%, 21%);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

export default MarketReports;
