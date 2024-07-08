import React, { useEffect, useState } from "react";
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

const summary = [
  {
    name: "New orders",
    total: 34,
    icon: <IoTimerOutline color="#000" />,
    backgroundColor: "#000",
  },
  {
    name: "Processing",
    total: 74,
    icon: <VscServerProcess color="#e71f27" />,
    backgroundColor: "#e71f27",
  },
  {
    name: "Completed",
    total: 12,
    icon: <BsExclamationOctagon color="#33336a" />,
    backgroundColor: "#33336a",
  },
  {
    name: "All orders",
    total: 349,
    icon: <FiShoppingBag color="#656281" />,
    backgroundColor: "#656281",
  },
];

const Orders = () => {
  const [clients, setClients] = useState([]);
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
  const { orders, status, error, filters } = useSelector(
    (state) => state.orders
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 10; // Number of items to show per page

  useEffect(() => {
    dispatch(fetchOrders({ currentPage, itemsPerPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await axios.get(
          "https://api.alphafunds.co.tz/api/v1/customers"
        );

        if (clientResponse.statusText === "OK") {
          setClients(clientResponse.data);
        }
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

  if (status === "loading") {
    return <div>Loading</div>;
  }
  if (status === "failed") {
    return <div>{error}</div>;
  }

  const receivedOrders = orders.data || [];

  const filteredOrders = receivedOrders.filter((order) => {
    if (filters.date === "today") {
      const today = dayjs();
      return dayjs(order.date).isSame(today, "day");
    } else if (filters.date === "weekly") {
      const startOfWeek = dayjs().startOf("week");
      const endOfWeek = dayjs().endOf("week");
      const orderDate = dayjs(order.date);
      return orderDate.isAfter(startOfWeek) && orderDate.isBefore(endOfWeek);
    } else if (filters.date === "monthly") {
      const startOfMonth = dayjs().startOf("month");
      const endOfMonth = dayjs().endOf("month");
      const orderDate = dayjs(order.date);
      return orderDate.isAfter(startOfMonth) && orderDate.isBefore(endOfMonth);
    } else if (filters.date === "annually") {
      const startOfYear = dayjs().startOf("year");
      const endOfYear = dayjs().endOf("year");
      const orderDate = dayjs(order.date);
      return orderDate.isAfter(startOfYear) && orderDate.isBefore(endOfYear);
    } else if (filters.date === "custom" && dateRange) {
      const [startDate, endDate] = dateRange;
      const orderDate = dayjs(order.date);
      return (
        orderDate.isSame(startDate, "day") ||
        (orderDate.isAfter(startDate) && orderDate.isBefore(endDate)) ||
        orderDate.isSame(endDate, "day")
      );
    } else if (filters.nameSearch) {
      return (
        order.customer?.name.toLowerCase() === filters.nameSearch.toLowerCase()
      );
    }
    return true;
  });

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
      orderData = filteredOrders;
      break;
    case "pending":
      orderData = filteredOrders.filter((order) => order.status === "new");
      break;
    case "complete":
      orderData = filteredOrders.filter((order) => order.balance === 0);
      break;
  }

  return (
    <Wrapper>
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
      <SummaryWrapper>
        {summary.map((item, index) => (
          <SummaryCard
            key={index}
            info={item.name}
            icon={item.icon}
            total={item.total}
            backgroundColor={item.backgroundColor}
          />
        ))}
      </SummaryWrapper>
      <OrderAction>
        <InputPicker
          data={customers}
          style={{ width: 250, marginRight: "auto" }}
          placeholder="Select Client"
          onChange={(value) => dispatch(setNameSearch(value))}
        />
        {/* <Input
          size="small"
          placeholder="ID Client"
          style={{ width: "300px" }}
          onChange={(value) => console.log(value)}
        /> */}
        {/* <Button
          style={{
            marginRight: "auto",
            color: "#fff",
            backgroundColor: "hsl(243deg, 50%, 50%)",
          }}
          onClick={() => console.log("Hello world")}
        >
          Filter
        </Button> */}
        <Dropdown renderToggle={renderButton}>
          <Dropdown.Item>Export PDF</Dropdown.Item>
          <Dropdown.Item>Export EXCELL</Dropdown.Item>
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
          {orderData?.map((order, index) => (
            <TableDataRow key={index}>
              <TableDataCell>{order.orderId}</TableDataCell>
              <TableDataCell>
                {dayjs(order.date).format("DD-MM-YYYY")}
              </TableDataCell>
              <TableDataCell
                onClick={() => {
                  navigate(`/customers/${order.customer?._id}`, {
                    state: order.customer,
                  });
                }}
              >
                {order.customer?.name}
              </TableDataCell>
              <TableDataCell>{order.security?.name}</TableDataCell>
              <TableDataCell>{order.type}</TableDataCell>
              <TableDataCell>{order.amount}</TableDataCell>
              <TableDataCell>{order.volume}</TableDataCell>
              <TableDataCell>{order.balance}</TableDataCell>
              <TableDataCell
                onClick={() =>
                  navigate(`/orders/${order.customer?._id}`, {
                    state: order,
                  })
                }
              >
                {order.status}
              </TableDataCell>
            </TableDataRow>
          ))}
        </Table>
        <Pagination>
          <Counter>{orders.totalDocuments} total orders</Counter>
          <ButtonToolbar>
            <Button
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)
              }
              style={{ color: "hsl(243deg, 50%, 50%)" }}
            >
              Prev
            </Button>
            <ButtonGroup>
              {Array.from(Array(orders.totalPages).keys())
                .map((x) => x + 1)
                .map((page) => (
                  <Button
                    style={{
                      backgroundColor: currentPage === page ? "#33336a" : "",
                      color: currentPage === page ? "white" : "grey",
                    }}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
            </ButtonGroup>
            <Button
              onClick={() =>
                setCurrentPage(
                  currentPage < orders.totalPages
                    ? currentPage + 1
                    : currentPage
                )
              }
              style={{ color: "hsl(243deg, 50%, 50%)" }}
            >
              Next
            </Button>
          </ButtonToolbar>
        </Pagination>
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
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const TopFilters = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 20px;
`;
const Filters = styled.div`
  display: flex;
`;

const SummaryWrapper = styled.div`
  display: flex;
  gap: 30px;
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
const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;
const Counter = styled.p``;
const Pages = styled.div``;

export default Orders;

// const filterOrders = useCallback(() => {
//   let filteredOrders = data ?? []; // Start with all data

//   if (activeFilter === "today") {
//     const today = dayjs();
//     filteredOrders = filteredOrders.filter((order) =>
//       dayjs(order.date).isSame(today, "day")
//     );
//   } else if (activeFilter === "weekly") {
//     const startOfWeek = dayjs().startOf("week");
//     const endOfWeek = dayjs().endOf("week");
//     filteredOrders = filteredOrders.filter((order) => {
//       const orderDate = dayjs(order.date);
//       return orderDate.isAfter(startOfWeek) && orderDate.isBefore(endOfWeek);
//     });
//   } else if (activeFilter === "monthly") {
//     const startOfMonth = dayjs().startOf("month");
//     const endOfMonth = dayjs().endOf("month");
//     filteredOrders = filteredOrders.filter((order) => {
//       const orderDate = dayjs(order.date);
//       return (
//         orderDate.isAfter(startOfMonth) && orderDate.isBefore(endOfMonth)
//       );
//     });
//   } else if (activeFilter === "annually") {
//     const startOfYear = dayjs().startOf("year");
//     const endOfYear = dayjs().endOf("year");
//     filteredOrders = filteredOrders.filter((order) => {
//       const orderDate = dayjs(order.date);
//       return orderDate.isAfter(startOfYear) && orderDate.isBefore(endOfYear);
//     });
//   } else if (activeFilter === "custom" && dateRange) {
//     const [startDate, endDate] = dateRange;
//     return orders.filter((order) => {
//       const orderDate = dayjs(order.date);
//       return (
//         orderDate.isSame(startDate, "day") ||
//         (orderDate.isAfter(startDate) && orderDate.isBefore(endDate)) ||
//         orderDate.isSame(endDate, "day")
//       );
//     });
//   }
//   if (filter) {
//     filteredOrders = filteredOrders.filter(
//       (order) => order.customer?.name === filter
//     );
//   }

//   return filteredOrders;
// }, [data, filter, activeFilter, dateRange]);

// useEffect(() => {
//   const filteredOrders = filterOrders();
//   // setOrders(filteredOrders);
// }, [filterOrders]);
