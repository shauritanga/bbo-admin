import React, { useState } from "react";
import { DateRangePicker } from "rsuite";
import { fetchDealings, setSearchFilter } from "../../reducers/dealingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import { Pagination, Stack } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";

const DealingSheet = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { dealings, status, error, filters } = useSelector(
    (state) => state.dealings
  );
  const [sort, setSort] = React.useState("all");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 10; // Number of items to show per page

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  React.useEffect(() => {
    dispatch(fetchDealings({ currentPage, itemsPerPage }));
  }, [dispatch, currentPage]);

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }
  console.log(dealings);
  const filteredDealings = dealings.data?.filter((dealing) => {
    if (filters.search) {
      return dealing.customer?.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    }
    return true;
  });

  return (
    <Wrapper>
      <Actions>
        <TextInput
          value={filters.search}
          onChange={(e) => dispatch(setSearchFilter(e.target.value))}
          placeholder="Search..."
        />
        <DateRangePicker />
        <select
          style={{
            width: "200px",
            marginLeft: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
            color: "#666",
            backgroundColor: "#fff",
            padding: "10px",
          }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="all">All</option>
          <option value="buy">New Order</option>
          <option value="pending">Pending</option>
          <option value="canceled">Canceled</option>
        </select>
        <Button>Export</Button>
      </Actions>
      <Sheet>
        <SheetHeader></SheetHeader>
        <SheetBody>
          {status === "loading" && (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>id</TableHeader>
                    <TableHeader>date</TableHeader>
                    <TableHeader>customer</TableHeader>
                    <TableHeader>security</TableHeader>
                    <TableHeader>type</TableHeader>
                    <TableHeader>price</TableHeader>
                    <TableHeader>volume</TableHeader>
                    <TableHeader>executed</TableHeader>
                    <TableHeader>balance</TableHeader>
                    <TableHeader>actions</TableHeader>
                  </TableRow>
                </TableHead>
              </Table>
              <div
                style={{
                  height: "500px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RotatingLines width="24" />
              </div>
            </>
          )}
          {status !== "loading" && status !== "failed" && (
            <>
              {" "}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>id</TableHeader>
                    <TableHeader>date</TableHeader>
                    <TableHeader>customer</TableHeader>
                    <TableHeader>security</TableHeader>
                    <TableHeader>type</TableHeader>
                    <TableHeader>price</TableHeader>
                    <TableHeader>volume</TableHeader>
                    <TableHeader>executed</TableHeader>
                    <TableHeader>balance</TableHeader>
                    <TableHeader>actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDealings?.map((dealing) => (
                    <TableRow key={dealing._id}>
                      <TableData>{dealing.orderId}</TableData>
                      <TableData>
                        {dayjs(dealing.date).format("DD-MM-YYYY")}
                      </TableData>
                      <TableData
                        style={{
                          color: "#007bff",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/customers/${dealing.customer._id}`, {
                            state: dealing.customer,
                          })
                        }
                      >
                        {dealing.customer?.name}
                      </TableData>
                      <TableData>{dealing.security?.name}</TableData>
                      <TableData>{dealing.type}</TableData>
                      <TableData>{dealing.price}</TableData>
                      <TableData>{dealing.volume}</TableData>
                      <TableData>{dealing.executed}</TableData>
                      <TableData>{dealing.balance}</TableData>
                      <TableData>
                        <span
                          style={{
                            color: "green",
                            backgroundColor: "#f5f5f5",
                            padding: "4px 6px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(`/orders/${dealing._id}`, {
                              state: dealing,
                            })
                          }
                        >
                          view
                        </span>
                      </TableData>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </SheetBody>
        <SheetFooter></SheetFooter>
        <PaginationWrapper>
          <Counter>{dealings.totalDocuments} total orders</Counter>
          <Stack spacing={2}>
            {/* <Pagination count={10} shape="rounded" /> */}
            <Pagination
              count={dealings.totalPages}
              variant="outlined"
              shape="rounded"
              color="primary"
              page={currentPage}
              onChange={handleChange}
            />
          </Stack>
        </PaginationWrapper>
      </Sheet>
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
const SheetFooter = styled.div``;
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

const Counter = styled.p``;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;

export default DealingSheet;
