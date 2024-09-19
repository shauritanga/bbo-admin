import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SummaryCard from "../../components/summary-card/SummaryCard";
import dayjs from "dayjs";
import { IoTimerOutline } from "react-icons/io5";
import { VscServerProcess } from "react-icons/vsc";
import { BsExclamationOctagon } from "react-icons/bs";
import { FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  setDateFilter,
  setNameSearch,
} from "../../reducers/orderSlice";
import styled from "styled-components";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Dropdown,
  Input,
  InputPicker,
  DateRangePicker,
  toaster,
  Notification,
  Pagination as RsuitePagination,
} from "rsuite";
import "rsuite/dist/rsuite.css";
import { GrCalendar, GrOrderedList } from "react-icons/gr";
import ModalView from "../../components/modals/Modal";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import OrderForm from "../../components/forms/order/OrderForm";
import FilterButton from "../../components/fiterButton/FilterButton";
import axios from "axios";
import * as XLSX from "xlsx";
import { Pagination, Stack } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import { OrderDataTable } from "@/components/orders/table";

const Orders = () => {
  const [clients, setClients] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [securities, setSecurities] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [allOrders, setAllOrders] = useState(null);
  const { orders, status, error, filters } = useSelector(
    (state) => state.orders
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 10; // Number of items to show per page

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  function toTitleCase(str) {
    return str.toLocaleLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  useEffect(() => {
    dispatch(fetchOrders({ currentPage, itemsPerPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          clientResponse,
          orderResponse,
          securityResponse,
          executionResponse,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/customers`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/orders`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/securities`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/executions`),
        ]);
        setExecutions(executionResponse.data);
        setAllOrders(orderResponse.data);
        setClients(clientResponse.data);
        setSecurities(securityResponse.data);
      } catch (err) {
        toaster.push(
          <Notification header="Error">
            Failed to fetch data: {err.message}
          </Notification>,
          { duration: 5000, placement: "topCenter" }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  if (clients === null || securities === null || allOrders === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <RotatingLines width="22" />
      </div>
    );
  }
  // if (status === "loading") {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         flex: 1,
  //       }}
  //     >
  //       <RotatingLines width="22" />
  //     </div>
  //   );
  // }
  if (status === "failed") {
    return <div>{error}</div>;
  }

  const totalOrders = allOrders?.length;
  const newOrders = allOrders?.filter(
    (order) => order.status.toLowerCase() === "new"
  ).length;

  const processingOrders = allOrders?.filter(
    (order) => order.status.toLowerCase() === "approved"
  ).length;

  const completeOrders = allOrders?.filter(
    (order) => order.status.toLowerCase() === "complete"
  ).length;

  const summary = [
    {
      name: "New orders",
      total: newOrders,
      icon: <IoTimerOutline color="#000" />,
      backgroundColor: "bg-black",
    },
    {
      name: "Processing",
      total: processingOrders,
      icon: <VscServerProcess color="#e71f27" />,
      backgroundColor: "bg-sky-500",
    },
    {
      name: "Completed",
      total: completeOrders,
      icon: <BsExclamationOctagon color="#33336a" />,
      backgroundColor: "bg-blue-700",
    },
    {
      name: "All orders",
      total: totalOrders,
      icon: <FiShoppingBag color="#656281" />,
      backgroundColor: "bg-red-500",
    },
  ];

  // const filteredOrders = receivedOrders.filter((order) => {
  //   if (filters.date === "today") {
  //     const today = dayjs();
  //     return dayjs(order.date).isSame(today, "day");
  //   } else if (filters.date === "weekly") {
  //     const startOfWeek = dayjs().startOf("week");
  //     const endOfWeek = dayjs().endOf("week");
  //     const orderDate = dayjs(order.date);
  //     return orderDate.isAfter(startOfWeek) && orderDate.isBefore(endOfWeek);
  //   } else if (filters.date === "monthly") {
  //     const startOfMonth = dayjs().startOf("month");
  //     const endOfMonth = dayjs().endOf("month");
  //     const orderDate = dayjs(order.date);
  //     return orderDate.isAfter(startOfMonth) && orderDate.isBefore(endOfMonth);
  //   } else if (filters.date === "annually") {
  //     const startOfYear = dayjs().startOf("year");
  //     const endOfYear = dayjs().endOf("year");
  //     const orderDate = dayjs(order.date);
  //     return orderDate.isAfter(startOfYear) && orderDate.isBefore(endOfYear);
  //   } else if (filters.date === "custom" && dateRange) {
  //     const [startDate, endDate] = dateRange;
  //     const orderDate = dayjs(order.date);
  //     return (
  //       orderDate.isSame(startDate, "day") ||
  //       (orderDate.isAfter(startDate) && orderDate.isBefore(endDate)) ||
  //       orderDate.isSame(endDate, "day")
  //     );
  //   } else if (filters.nameSearch) {
  //     return (
  //       order.customer?.name.toLowerCase() === filters.nameSearch.toLowerCase()
  //     );
  //   }
  //   return true;
  // });

  const renderButton = (props, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        style={{ color: "#fff", backgroundColor: "hsl(243deg, 50%, 50%)" }}
      >
        Export
      </Button>
    );
  };

  const customers = clients.map((item) => ({
    label: item.name,
    value: item.name,
  }));
  const q = searchParams.get("q");
  let orderData = null;
  switch (q) {
    case "all":
      orderData = orders;
      break;
    case "pending":
      orderData = orders.data?.filter(
        (order) => order.status?.toLowerCase() === "approved"
      );
      break;
    case "complete":
      orderData = orders.data?.filter(
        (order) => order.status?.toLowerCase() === "complete"
      );
      break;
    case "cancelled":
      orderData = orders.data?.filter(
        (order) => order.status?.toLowerCase() === "cancelled"
      );
      break;
  }

  const exportToExcel = async () => {
    //const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/vat`);
    const data = orderData;

    //xlsx
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Orders.xlsx");
  };

  const orderTableData = allOrders?.map((order) => {
    const customer = clients.filter((client) => client._id === order.userId)[0];
    const security = securities?.filter(
      (security) => security._id === order.securityId
    )[0];
    return {
      id: order.uid ?? "",
      orderId: order._id,
      name: customer?.name,
      status: order.status,
      security: security?.name,
      amount: order.amount,
      type: order.type,
      date: order.date,
      volume: order.volume,
      balance: order.volume - order.executed,
    };
  });

  return (
    <div className="flex flex-col gap-4 min-h-screen mb-4">
      <TopFilters>
        <Breadcrumbs data={["Home", "CRM", "Orders"]} />
        <Filters>
          <FilterButton
            name="today"
            activeFilter={filters.date}
            onClick={(e) => dispatch(setDateFilter(e))}
          >
            Today
          </FilterButton>
          <FilterButton
            name="weekly"
            activeFilter={filters.date}
            onClick={(e) => dispatch(setDateFilter(e))}
          >
            Weekly
          </FilterButton>
          <FilterButton
            name="monthly"
            activeFilter={filters.date}
            onClick={(e) => dispatch(setDateFilter(e))}
          >
            Monthly
          </FilterButton>
          <FilterButton
            name="annually"
            activeFilter={filters.date}
            onClick={(e) => dispatch(setDateFilter(e))}
          >
            Annually
          </FilterButton>
          <FilterButton
            name="custom"
            activeFilter={filters.date}
            onClick={(e) => dispatch(setDateFilter(e))}
            setOpen={setOpen}
          >
            <GrCalendar />
          </FilterButton>
        </Filters>
      </TopFilters>
      <div className="flex gap-4">
        {summary.map((item, index) => (
          <SummaryCard
            key={index}
            info={item.name}
            icon={item.icon}
            total={item.total}
            backgroundColor={item.backgroundColor}
          />
        ))}
      </div>
      <OrderAction>
        <InputPicker
          data={customers}
          style={{ width: 250, marginRight: "auto" }}
          placeholder="Select Client"
          onChange={(value) => dispatch(setNameSearch(value))}
        />

        <Dropdown renderToggle={renderButton}>
          <Dropdown.Item>Export PDF</Dropdown.Item>
          <Dropdown.Item onClick={exportToExcel}>Export EXCELL</Dropdown.Item>
        </Dropdown>
        <Button
          style={{
            color: "#fff",
            backgroundColor: "hsl(243deg, 50%, 50%)",
          }}
          onClick={() => setIsOrderModalOpen(true)}
        >
          New Order
        </Button>
      </OrderAction>
      <TableWrapper>
        <OrderDataTable orders={orderTableData} />
        <Table>
          <TableHeaderRow>
            <TableHeaderCell>id</TableHeaderCell>
            <TableHeaderCell>date</TableHeaderCell>
            <TableHeaderCell>customer</TableHeaderCell>
            <TableHeaderCell>security</TableHeaderCell>
            <TableHeaderCell>type</TableHeaderCell>
            <TableHeaderCell>amount</TableHeaderCell>
            <TableHeaderCell>volume</TableHeaderCell>
            <TableHeaderCell>balance</TableHeaderCell>
            <TableHeaderCell>status</TableHeaderCell>
          </TableHeaderRow>
          {status === "loading" ? (
            <TableDataRow>
              <TableDataCell colSpan={9} rowSpan={10}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <RotatingLines width="22" />
                </div>
              </TableDataCell>
            </TableDataRow>
          ) : (
            orderData.data?.map((order, index) => {
              const orderSecurity = securities?.filter(
                (security) => security._id === order.securityId
              );

              const orderClient = clients?.filter(
                (client) => client._id === order.userId
              );

              return (
                <TableDataRow key={index}>
                  <TableDataCell>{order.uid}</TableDataCell>
                  <TableDataCell>
                    {dayjs(order.date).format("DD-MM-YYYY")}
                  </TableDataCell>
                  <TableDataCell
                    onClick={() => {
                      navigate(`/customers/${orderClient[0]?._id}`, {
                        state: orderClient[0],
                      });
                    }}
                  >
                    {orderClient[0]?.name}
                  </TableDataCell>
                  <TableDataCell>{orderSecurity[0]?.name}</TableDataCell>
                  <TableDataCell>{toTitleCase(order.type)}</TableDataCell>
                  <TableDataCell>{order.amount}</TableDataCell>
                  <TableDataCell>{order.volume}</TableDataCell>
                  <TableDataCell>{order.volume - order.executed}</TableDataCell>
                  <TableDataCell
                    onClick={() =>
                      navigate(`/orders/${order._id}`, {
                        state: {
                          order: order,
                          client: orderClient[0],
                          security: orderSecurity[0],
                        },
                      })
                    }
                  >
                    {toTitleCase(order.status)}
                  </TableDataCell>
                </TableDataRow>
              );
            })
          )}
        </Table>
        <PaginationWrapper>
          <Counter>{orders.totalDocuments} total orders</Counter>
          <Stack spacing={2}>
            {/* <Pagination count={10} shape="rounded" /> */}
            <Pagination
              count={orders.totalPages}
              variant="outlined"
              shape="rounded"
              color="primary"
              page={currentPage}
              onChange={handleChange}
            />
          </Stack>
        </PaginationWrapper>
      </TableWrapper>
      <ModalView
        title="Select Date Range"
        dateRange={dateRange}
        setDateRange={setDateRange}
        open={open}
        setOpen={setOpen}
        size="xs"
      />
      <OrderForm
        title="New Order"
        open={isOrderModalOpen}
        size={750}
        setOpen={setIsOrderModalOpen}
      />
    </div>
  );
};

const TopFilters = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 20px;
`;
const Filters = styled.div`
  display: flex;
`;
const OrderAction = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 7px;
`;

const TableWrapper = styled.div`
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  padding: 20px;
  border-radius: 7px;
`;

const Table = styled.table`
  width: 100%;
`;
const TableHeaderRow = styled.tr`
  text-align: left;
  text-transform: uppercase;
  background-color: hsl(0deg 0% 80%);
`;
const TableHeaderCell = styled.th`
  padding: 10px;
`;
const TableDataRow = styled.tr`
  border-bottom: 0.5px solid #ccc;
  &:nth-of-type(odd) {
    background-color: hsl(250deg 50% 99%);
  }
`;
const TableDataCell = styled.td`
  padding: 10px;
  font-size: 0.75rem;
  &:nth-of-type(3n),
  &:last-of-type {
    cursor: pointer;
  }
`;
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;
const Counter = styled.p``;
const Pages = styled.div``;

export default Orders;
