import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchEmployees,
  setCounter,
  setSearch,
} from "../../reducers/employeeSlice";
import styled from "styled-components";
import Select from "../../components/select/Select";
import CreateEmployeeForm from "../../components/forms/employee/CreateEmployeeForm";

function Employee() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { employees, status, error, filters } = useSelector(
    (state) => state.employees
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const filteredEmployees = employees
    .slice(0, filters.counter)
    .filter((employee) => {
      const matchesQuery =
        !filters.search ||
        employee.name.toLowerCase().includes(filters.search.toLowerCase());
      return matchesQuery;
    });
  return (
    <Wrapper>
      <Action>
        <Select
          width={80}
          value={filters.counter}
          onChange={(e) => dispatch(setCounter(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </Select>
        <TextInput
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          placeholder="Search..."
        />
        <Button onClick={() => setOpen(true)}>Add Employee</Button>
      </Action>
      <TableWrapper>
        <Table>
          <thead>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>role</TableHeaderCell>
              <TableHeaderCell>status</TableHeaderCell>
            </TableHeaderRow>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <TableDataRow key={employee.id}>
                <TableDataCell>{employee.name}</TableDataCell>
                <TableDataCell>{employee.email}</TableDataCell>
                <TableDataCell>{employee.phone}</TableDataCell>
                <TableDataCell>
                  {employee.role?.name.toUpperCase()}
                </TableDataCell>
                <TableDataCell>
                  <span
                    onClick={() => {
                      navigate(`/employees/${employee._id}`, {
                        state: employee,
                      });
                    }}
                    style={{
                      color: employee.status === "active" ? "green" : "red",
                      backgroundColor:
                        employee.status === "active"
                          ? "rgba(0, 128, 0, 0.1)"
                          : "rgba(255, 0, 0, 0.1)",
                      padding: "3px 6px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    {employee.status}
                  </span>
                </TableDataCell>
              </TableDataRow>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
      <CreateEmployeeForm open={open} setOpen={setOpen} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 20px;
`;
const Action = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;
const Button = styled.button`
  background-color: hsl(243, 50%, 21%);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: hsl(243, 50%, 30%);
  }
`;
const TextInput = styled.input`
  width: 340px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-left: auto;
`;
const TableWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
const Table = styled.table`
  width: 100%;
`;
const TableHeaderRow = styled.tr`
  background-color: hsl(0, 0%, 80%);
  border-bottom: 1px solid #ccc;
`;
const TableHeaderCell = styled.th`
  text-align: left;
  padding: 10px;
  text-transform: uppercase;
  font-size: 0.8rem;
`;
const TableDataRow = styled.tr`
  &:nth-of-type(odd) {
    background-color: hsl(250deg 50% 99%);
  }
`;
const TableDataCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;
export default Employee;
