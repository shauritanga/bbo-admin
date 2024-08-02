import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { DateRangePicker, toaster, Notification } from "rsuite";
import useSWR from "swr";
import format from "date-fns/format";
import "rsuite/DateRangePicker/styles/index.css";
import styled from "styled-components";
import Select from "../../components/select";
import Spacer from "../../components/spacer/Spacer";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import { GrCalendar } from "react-icons/gr";
import ModalView from "../../components/modals/Modal";
import { IoTimerOutline } from "react-icons/io5";
import { VscServerProcess } from "react-icons/vsc";
import { BsExclamationOctagon } from "react-icons/bs";
import { FiShoppingBag } from "react-icons/fi";
import SummaryCard from "../../components/summary-card/SummaryCard";
import CustomerForm from "../../components/forms/customer/CustomerForm";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { Pagination, Stack } from "@mui/material";
const fetcher = (url) => fetch(url).then((res) => res.json());

function Customers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState(null);
  const [profiles, setProfiles] = useState(null);
  const [customerFilter, setCustomerFilter] = useState("all");
  const [active, setActive] = useState("today");
  const [dateRage, setDateRage] = useState(false);
  const [customerForm, setCustomerForm] = useState(false);
  const [dateSelected, setDateSelected] = useState(() => {
    return { startDate: Date.now(), endDate: Date.now() };
  });
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const { data, error, loading } = useSWR(
    `${import.meta.env.VITE_BASE_URL}/statements?startDate=${new Date(
      dateSelected.startDate
    ).toISOString()}&endDate=${new Date(dateSelected.endDate).toISOString()}`,
    fetcher
  );
  if (error) {
    console.log(error);
  }

  if (!error && !loading) {
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, customerResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/profiles`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/customers`),
        ]);

        setProfiles(profileResponse.data);
        setCustomers(customerResponse.data);
      } catch (error) {
        toaster.push(<Notification></Notification>, {
          duration: 4000,
          placement: "topCenter",
        });
      }
    };
    fetchData();
  }, []);

  if (!customers || !profiles) {
    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RotatingLines width="25" />
      </div>
    );
  }

  const newCustomers = customers?.filter(
    (customer) => customer.status.toLowerCase() === "new"
  ).length;
  const pendingCustomers = customers?.filter(
    (customer) => customer.status.toLowerCase() === "pending"
  ).length;
  const totalCustomers = customers.length;
  const summary = [
    {
      name: "New",
      total: newCustomers,
      icon: <IoTimerOutline color="#000" />,
      backgroundColor: "#000",
    },
    {
      name: "Pending",
      total: pendingCustomers,
      icon: <VscServerProcess color="#33336a" />,
      backgroundColor: "#33336a",
    },
    {
      name: "Total",
      total: totalCustomers,
      icon: <BsExclamationOctagon color="#656281" />,
      backgroundColor: "#656281",
    },
    {
      name: "issues",
      total: 0,
      icon: <FiShoppingBag color="#e71f27" />,
      backgroundColor: "#e71f27",
    },
  ];

  const totalPages = Math.ceil(customers?.length / itemsPerPage);

  const currentData = customers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Wrapper>
      <TopFilters>
        <Breadcrumbs data={["Home", "Customers", "all"]} />
        <Filters>
          <FilterButton
            name="today"
            onClick={(e) => setActive(e.target.name)}
            style={
              active === "today"
                ? { backgroundColor: "hsl(243deg, 20%, 70%)" }
                : {}
            }
          >
            Today
          </FilterButton>
          <FilterButton
            name="weekly"
            onClick={(e) => setActive(e.target.name)}
            style={
              active === "weekly"
                ? { backgroundColor: "hsl(243deg, 20%, 70%)" }
                : {}
            }
          >
            Weekly
          </FilterButton>
          <FilterButton
            name="monthly"
            onClick={(e) => setActive(e.target.name)}
            style={
              active === "monthly"
                ? { backgroundColor: "hsl(243deg, 20%, 70%)" }
                : {}
            }
          >
            Monthly
          </FilterButton>
          <FilterButton
            name="annually"
            onClick={(e) => setActive(e.target.name)}
            style={
              active === "annually"
                ? { backgroundColor: "hsl(243deg, 20%, 70%)" }
                : {}
            }
          >
            Annually
          </FilterButton>
          <FilterButton onClick={() => setDateRage(true)}>
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
      <Actions>
        <DateRangePicker
          placeholder="Select Date Range"
          renderValue={([start, end]) => {
            return (
              format(start, "EEE, d MMM") + " - " + format(end, "EEE, d MMM")
            );
          }}
          onChange={(range) =>
            setDateSelected({ startDate: range[0], endDate: range[1] })
          }
        />
        <Select
          value={customerFilter}
          onChange={(e) => e.target.value}
          width={350}
        >
          <option value="all">All customers</option>
          <option value="New">New Customers</option>
          <option value="pending">Pending</option>
          <option value="cancel">Cancel request</option>
        </Select>
        <Button>Export</Button>
        <Spacer />
        <Button>Filter Customer</Button>
        <Button onClick={() => setCustomerForm(true)}>Create Customer</Button>
      </Actions>
      <TableWrapper>
        <Table>
          <thead>
            <TableHeaderRow>
              <TableHeaderCell>name</TableHeaderCell>
              <TableHeaderCell>contact</TableHeaderCell>
              <TableHeaderCell>country</TableHeaderCell>
              <TableHeaderCell>status</TableHeaderCell>
              <TableHeaderCell>action</TableHeaderCell>
            </TableHeaderRow>
          </thead>
          <tbody>
            {currentData?.map((customer) => {
              const profile = profiles?.filter(
                (profile) => profile.user_id === customer.id
              );

              return (
                <TableDataRow key={customer._id}>
                  <TableDataCell>
                    <p>{customer.name}</p>
                  </TableDataCell>
                  <TableDataCell>
                    <p>{customer.email}</p>
                    <p>{profile[0]?.mobile}</p>
                  </TableDataCell>
                  <TableDataCell>{profile[0]?.nationality}</TableDataCell>
                  <TableDataCell>{customer.status}</TableDataCell>
                  <TableDataCell>
                    <ViewButton
                      onClick={() =>
                        navigate(`/customers/${customer.id}`, {
                          state: customer,
                        })
                      }
                    >
                      view
                    </ViewButton>
                  </TableDataCell>
                </TableDataRow>
              );
            })}
          </tbody>
        </Table>
        <PaginationWrapper>
          <Counter>{customers?.length} total orders</Counter>
          <Stack spacing={2}>
            {/* <Pagination count={10} shape="rounded" /> */}
            <Pagination
              count={totalPages}
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
        open={dateRage}
        size="xs"
        setOpen={setDateRage}
        body={<DateRangePicker style={{ width: "100%" }} />}
      />
      <CustomerForm
        open={customerForm}
        setOpen={setCustomerForm}
        size={750}
        title="New Customer"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  gap: 30px;
  padding: 20px;
  margin-bottom: 50px;
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
const FilterButton = styled.button`
  display: flex;
  align-items: center;

  padding: 8px 20px;
  background-color: inherit;
  border: 1px solid hsl(243deg, 50%, 50%);
  &:not(:first-of-type) {
    border-left: 0;
  }
  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }
  &:last-of-type {
    border-radius: 0 5px 5px 0;
    padding: 8px 10px;
  }
`;

const SummaryWrapper = styled.div`
  display: flex;
  gap: 30px;
`;
const Actions = styled.div`
  display: flex;
  gap: 30px;
  padding: 20px;
  border-radius: 7px;
  background-color: var(--color-white);
  filter: drop-shadow(0px 2px 8px rgba(74, 70, 132, 0.4));
`;
const Button = styled.button`
  background-color: hsl(243deg, 50%, 21%);
  color: #fff;
  border-radius: 5px;
  min-width: 180px;
  padding: 10px 20px;
`;
const TableWrapper = styled.div`
  padding: 20px;
  border-radius: 7px;
  background-color: var(--color-white);
  filter: drop-shadow(0px 2px 8px rgba(74, 70, 132, 0.4));
`;
const Table = styled.table`
  width: 100%;
`;
const TableHeaderRow = styled.tr``;
const TableDataRow = styled.tr`
  border-bottom: 0.04px solid #ddd;
`;
const TableHeaderCell = styled.th`
  padding: 14px 20px;
  text-transform: uppercase;
  background-color: hsl(250deg 10% 90%);
  text-align: left;
  border: none;
`;
const TableDataCell = styled.td`
  padding: 8px 10px;
`;
const ViewButton = styled.button`
  background-color: hsl(243deg 20% 90%);
  border-radius: 12px;
  padding: 4px 9px;
  cursor: pointer;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;
const Counter = styled.p``;
const Pages = styled.div``;
export default Customers;
