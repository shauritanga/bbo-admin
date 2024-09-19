import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Select from "../../components/select";
import SecurityForm from "../../components/forms/security/SecurityForm";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSecurities,
  setQueryFilter,
  setCounterFilter,
} from "../../reducers/securitySlice";
import { CiEdit, CiTrash } from "react-icons/ci";
import EditSecurityForm from "../../components/forms/security/EditSecurityForm";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function Security({ backgroundColor }) {
  const [data, setData] = useState({
    id: "",
    name: "",
    price: "",
  });

  const dispatch = useDispatch();
  const { securities, status, error, filters } = useSelector(
    (state) => state.securities
  );
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchSecurities());
  }, [dispatch]);

  const filteredSecurities = securities
    .slice(0, filters.counter)
    .filter((security) => {
      const matchesQuery =
        !filters.query ||
        security.name.toLowerCase().includes(filters.query.toLowerCase());
      return matchesQuery;
    });

  if (status === "loading") {
    return <div>Loading...</div>;
  } else if (status === "failed") {
    return <div>Error: {error}</div>;
  } else if (status === "succeeded") {
    return (
      <Wrapper>
        <Action style={{ "--background-color": backgroundColor }}>
          <Select
            width={80}
            value={filters.counter}
            onChange={(e) => dispatch(setCounterFilter(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
          <TextInput
            type="text"
            value={filters.query}
            placeholder="Searching..."
            onChange={(e) => dispatch(setQueryFilter(e.target.value))}
          />
          <Button onClick={() => setOpen(true)}>Add Security</Button>
        </Action>
        <TableWrapper>
          <Table>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>Security</TableHeaderCell>
                <TableHeaderCell>Number</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>actions</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {filteredSecurities?.map((security) => (
                <TableDataRow key={security._id}>
                  <TableDataRowCell>{security.name}</TableDataRowCell>
                  <TableDataRowCell>{security.number}</TableDataRowCell>
                  <TableDataRowCell>{security.price}</TableDataRowCell>
                  <TableDataRowCell style={{ display: "flex", gap: "20px" }}>
                    <span style={{ cursor: "pointer" }}>
                      <CiEdit
                        onClick={() => {
                          setData({
                            id: security._id,
                            name: security.name,
                            price: security.price,
                          });
                          setOpenEdit(true);
                        }}
                      />
                    </span>
                    <span style={{ cursor: "pointer" }}>
                      <CiTrash color="red" onClick={() => setIsOpen(true)} />
                    </span>
                  </TableDataRowCell>
                </TableDataRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
        <SecurityForm open={open} setOpen={setOpen} />
        <EditSecurityForm open={openEdit} setOpen={setOpenEdit} data={data} />
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsOpen(false)}>No</Button>
            <Button onClick={() => setIsOpen(true)} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  gap: 30px;
  flex-direction: column;
`;

const Action = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  background-color: var(--background-color);
  border-radius: 7px;
  padding: 10px 20px;
`;
const TextInput = styled.input`
  height: 32px;
  width: 340px;
  margin-left: auto;
  background-color: inherit;
  border: 0.5px solid hsl(0deg 0% 70%);
  border-radius: 4px;
  //margin-right: auto;
  color: inherit;
  padding: 10px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: hsl(243deg 50% 21%);
  height: 31px;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: hsl(0deg 0% 75%);
  }
`;

const TableWrapper = styled.div`
  padding: 20px;
  background-color: hsl(0deg 0% 100%);
  border-radius: 7px;
`;
const Table = styled.table`
  background-color: #fff;
  border-collapse: collapse;
  width: 100%;
`;

const TableHeaderRow = styled.tr``;
const TableHeaderCell = styled.th`
  text-transform: uppercase;
  background-color: hsl(0deg 0% 80%);
  text-align: left;
  padding: 10px 20px;
`;
const TableDataRow = styled.tr`
  border-bottom: 0.5px solid #ccc;
  &:nth-of-type(odd) {
    background-color: hsl(250deg 50% 99%);
  }
`;
const TableDataRowCell = styled.td`
  padding: 10px 20px;
`;

const Drop = styled.div`
  display: flex;
  flex-direction: column;
  display: none;
`;

export default Security;
