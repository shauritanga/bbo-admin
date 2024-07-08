import React, { useEffect, useState } from "react";
import styled from "styled-components";
import RoleForm from "../../components/forms/role/RoleForm";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../reducers/employeeSlice.js";

function Role() {
  const [open, setOpen] = useState(false);
  const { employees, status, error } = useSelector((state) => state.employees);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  } else if (status === "failed") {
    return <div>Error: {error}</div>;
  } else if (status === "succeeded") {
    return (
      <Wrapper>
        <RoleWrapper>
          <Card>
            <User>
              <Button onClick={() => setOpen(true)}>Add New Role</Button>
            </User>
          </Card>
          <Card>
            <User>
              <span>Total {6} users</span>
              <AvatarWrapper>
                <Avatar style={{ backgroundColor: "red" }}></Avatar>
                <Avatar style={{ backgroundColor: "green" }}></Avatar>
                <Avatar style={{ backgroundColor: "yellow" }}></Avatar>
                <Avatar style={{ backgroundColor: "orange" }}></Avatar>
              </AvatarWrapper>
            </User>
            <Title>ADMIN</Title>
            <Actions>
              <TextButton
                onClick={() => setOpen(true)}
                style={{ color: "hsl(243deg 70% 21%" }}
              >
                Edit Role
              </TextButton>
              <TextButton style={{ color: "red" }}>Delete Role</TextButton>
            </Actions>
          </Card>

          <Card>3</Card>
          <Card>4</Card>
          <Card>5</Card>
          <Card>6</Card>
        </RoleWrapper>
        <UserList>
          <Table>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>name</TableHeaderCell>
                <TableHeaderCell>roles</TableHeaderCell>
                <TableHeaderCell>permissions</TableHeaderCell>
                <TableHeaderCell>actions</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <TableDataRow>
                  <TableDataCell>{employee.name}</TableDataCell>
                  <TableDataCell>{employee.role?.name}</TableDataCell>
                  <TableDataCell>{employee.permi}</TableDataCell>
                  <TableDataCell>{employee.actions}</TableDataCell>
                </TableDataRow>
              ))}
            </tbody>
          </Table>
        </UserList>
        <RoleForm open={open} setOpen={setOpen} />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;
`;
const RoleWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  grid-template-rows: 150px;
  width: 100%;
  gap: 20px;
  grid-auto-rows: 150px;
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
`;
const Button = styled.button`
  color: hsl(243deg 50% 100%);
  background-color: hsl(243deg 50% 21%);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;
const Title = styled.span`
  font-size: 1.1rem;
`;
const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;
const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const Avatar = styled.div`
  height: 30px;
  width: 30px;
  margin-left: -13px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid #fff;
`;
const UserList = styled.div`
  padding: 20px;
  background-color: hsl(0deg 0% 100%);
`;
const Table = styled.table`
  width: 100%;
`;
const TableHeaderRow = styled.tr``;
const TableHeaderCell = styled.th`
  text-align: left;
  background-color: #f2f2f2;
  padding: 10px;
  text-transform: uppercase;
  font-size: 0.8rem;
`;
const TableDataRow = styled.tr``;
const TableDataCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;
const Actions = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 15px;
`;
const TextButton = styled.button`
  color: hsl(243deg 50% 21%);
  background-color: transparent;
`;

export default Role;
