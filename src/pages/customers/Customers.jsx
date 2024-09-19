import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { DateRangePicker, toaster, Notification } from "rsuite";
import useSWR from "swr";
import "rsuite/DateRangePicker/styles/index.css";
import styled from "styled-components";

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

import { CustomerDataTable } from "@/components/customer/table";
const fetcher = (url) => fetch(url).then((res) => res.json());

function Customers() {
  const [customers, setCustomers] = useState(null);

  const [active, setActive] = useState("today");
  const [dateRage, setDateRage] = useState(false);
  const [customerForm, setCustomerForm] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [dateSelected, setDateSelected] = useState(() => {
    return { startDate: Date.now(), endDate: Date.now() };
  });
  const navigate = useNavigate();

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
        const customerResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/customers`
        );

        setCustomers(customerResponse.data);
      } catch (error) {
        toaster.push(<Notification>Fail to fetch customers</Notification>, {
          duration: 4000,
          placement: "topCenter",
        });
      }
    };
    fetchData();
  }, []);

  if (!customers) {
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
      backgroundColor: "bg-black",
    },
    {
      name: "Pending",
      total: pendingCustomers,
      icon: <VscServerProcess color="#33336a" />,
      backgroundColor: "bg-blue-700",
    },
    {
      name: "Total",
      total: totalCustomers,
      icon: <BsExclamationOctagon color="#656281" />,
      backgroundColor: "bg-sky-500",
    },
    {
      name: "issues",
      total: 0,
      icon: <FiShoppingBag color="#e71f27" />,
      backgroundColor: "bg-red-500",
    },
  ];

  const customersData = customers.map((customer) => {
    return {
      name: customer.name,
      contact: customer.email,
      nationality: customer.nationality,
      status: customer.status,
    };
  });

  const searchedCustomer = customers?.filter((customer) =>
    customer.name?.toLowerCase().includes(clientSearch?.toLocaleLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex flex-col bg-white shadow-md p-2 gap-4 mb-4">
        <CustomerDataTable customers={customers} />
      </div>

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
    </div>
  );
}

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

const Button = styled.button`
  background-color: hsl(243deg, 50%, 21%);
  color: #fff;
  border-radius: 5px;
  min-width: 180px;
  padding: 10px 20px;
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
const Counter = styled.p``;
const Pages = styled.div``;
export default Customers;
