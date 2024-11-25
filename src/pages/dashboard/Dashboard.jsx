import React, { memo, useEffect, useMemo, useState } from "react";

import styled from "styled-components";
import { LineChart } from "@mui/x-charts";
import axios from "axios";
import { getMonthName } from "../../utils/getMonthName";
import { useAuth } from "../../provider/AuthProvider";
import { RotatingLines } from "react-loader-spinner";
import Card from "../../components/Card";
import { axiosInstance } from "@/utils/axiosConfig";

const pieData = [
  [
    {
      id: "April",
      label: "April",
      value: 402,
      color: "hsl(354, 70%, 50%)",
    },
    {
      id: "May",
      label: "May",
      value: 100,
      color: "hsl(306, 70%, 50%)",
    },
  ],
  [
    {
      id: "April",
      label: "April",
      value: 202,
      color: "hsl(354, 70%, 50%)",
    },
    {
      id: "May",
      label: "May",
      value: 180,
      color: "hsl(306, 70%, 50%)",
    },
  ],
  [
    {
      id: "April",
      label: "April",
      value: 300,
      color: "hsl(354, 70%, 50%)",
    },
    {
      id: "May",
      label: "May",
      value: 200,
      color: "hsl(306, 70%, 50%)",
    },
  ],
];

const names = ["Earnings", "Expenses", "Quaters"];

const columns = [
  { id: "1", name: "#" },
  { id: "2", name: "Account" },
  { id: "3", name: "Balance" },
];
const rows = [
  {
    id: 1,
    name: "Purchases",
    amount: "18,570,000",
  },
  {
    id: 2,
    name: "Salary",
    amount: "97,400,000",
  },
  {
    id: 3,
    name: "Salary",
    amount: "40,000,000",
  },
];
const Dashboard = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const userObject = typeof user === "string" ? JSON.parse(user) : user;

  let formater = Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerResponse, orderResponse] = await Promise.all([
          axiosInstance.get(`/customers`),
          axiosInstance.get(`/orders`),
        ]);

        setCustomers(customerResponse.data);
        setOrders(orderResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
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

  const totalIncome = incomes?.reduce((prev, curr) => prev + curr.value, 0);

  const activeCustomers = customers?.filter(
    (customer) => customer.status === "active"
  )?.length;

  const totalOrders = orders?.length;
  const totalExpenses = expenses?.reduce((acc, curr) => acc + curr.amount, 0);
  //calculation for pie chart
  const today = new Date();
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const endOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    0,
    23,
    59,
    59
  );
  const startOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const endOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const lastMonthName = getMonthName(startOfLastMonth.getMonth());
  const currentMonthName = getMonthName(startOfCurrentMonth.getMonth());

  const totalLastMonthExpenses = memo(
    () =>
      expenses
        ?.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate >= startOfLastMonth && expenseDate < endOfLastMonth
          );
        })
        .reduce((acc, curr) => acc + curr.amount, 0),
    [expenses]
  );

  const totalCurrentMonthExpenses = expenses
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate >= startOfCurrentMonth && expenseDate < endOfCurrentMonth
      );
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  //percentage
  const percent =
    (totalCurrentMonthExpenses - totalLastMonthExpenses) /
    totalLastMonthExpenses;

  const percentComparison = Math.round((percent * 100 + Number.EPSILON) * 1);

  //CALCULATION FOR LINE CHART
  //01 January
  const startOfJanuary = new Date(today.getFullYear(), 0, 1);
  const endOfJanuary = new Date(today.getFullYear(), 1, 0, 23.59, 59);
  const totalJanuaryExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfJanuary && expenseDate < endOfJanuary;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //02 February
  const startOfFebruary = new Date(today.getFullYear(), 1, 1);
  const endOfFebruary = new Date(today.getFullYear(), 2, 0, 23.59, 59);
  const totalFebruaryExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfFebruary && expenseDate < endOfFebruary;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //03 March
  const startOfMarch = new Date(today.getFullYear(), 2, 1);
  const endOfMarch = new Date(today.getFullYear(), 3, 0, 23.59, 59);
  const totalMarchExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMarch && expenseDate < endOfMarch;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //04 April
  const startOfApril = new Date(today.getFullYear(), 3, 1);
  const endOfApril = new Date(today.getFullYear(), 4, 0, 23.59, 59);
  const totalAprilExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfApril && expenseDate < endOfApril;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //05 May
  const startOfMay = new Date(today.getFullYear(), 4, 1);
  const endOfMay = new Date(today.getFullYear(), 5, 0, 23.59, 59);
  const totalMayExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMay && expenseDate < endOfMay;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //06 June
  const startOfJune = new Date(today.getFullYear(), 5, 1);
  const endOfJune = new Date(today.getFullYear(), 6, 0, 23.59, 59);
  const totalJuneExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfJune && expenseDate < endOfJune;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //07 July
  const startOfJuly = new Date(today.getFullYear(), 6, 1);
  const endOfJuly = new Date(today.getFullYear(), 7, 0, 23.59, 59);
  const totalJulyExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfJuly && expenseDate < endOfJuly;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //08 August
  const startOfAugust = new Date(today.getFullYear(), 7, 1);
  const endOfAugust = new Date(today.getFullYear(), 8, 0, 23.59, 59);
  const totalAugustExpenses = incomes
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfAugust && expenseDate < endOfAugust;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //09 September
  const startOfSeptember = new Date(today.getFullYear(), 8, 1);
  const endOfSeptember = new Date(today.getFullYear(), 9, 0, 23.59, 59);
  const totalSeptemberExpenses = incomes
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfSeptember && expenseDate < endOfSeptember;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //10 October
  const startOfOctober = new Date(today.getFullYear(), 9, 1);
  const endOfOctober = new Date(today.getFullYear(), 10, 0, 23.59, 59);
  const totalOctoberExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfOctober && expenseDate < endOfOctober;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //11 November
  const startOfNovember = new Date(today.getFullYear(), 10, 1);
  const endOfNovember = new Date(today.getFullYear(), 11, 0, 23.59, 59);
  const totalNovemberExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfNovember && expenseDate < endOfNovember;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //12 December
  const startOfDecember = new Date(today.getFullYear(), 11, 1);
  const endOfDecember = new Date(today.getFullYear(), 12, 0, 23.59, 59);
  const totalDecemberExpenses = incomes
    ?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfDecember && expenseDate < endOfDecember;
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  const lineData = [
    totalJanuaryExpenses,
    totalFebruaryExpenses,
    totalMarchExpenses,
    totalAprilExpenses,
    totalMayExpenses,
    totalJuneExpenses,
    totalJulyExpenses,
    totalAugustExpenses,
    totalSeptemberExpenses,
    totalOctoberExpenses,
    totalNovemberExpenses,
    totalDecemberExpenses,
  ];

  const staff = userObject;

  return (
    <div className="flex flex-col gap-6 min-h-screen py-6 bg-slate-100 mt-4">
      <div className="flex gap-4">
        <Card backgroundColor="bg-blue-500">
          <span>Current Income</span>
          <span>{formater.format(totalIncome)}</span>
        </Card>
        <Card backgroundColor="bg-red-500">
          <span>Current Customers</span>
          <span>{customers.length}</span>
        </Card>
        <Card backgroundColor="bg-blue-900">
          <span>Active Customers</span>
          <span>{`${(activeCustomers / customers.length).toFixed(2)} %`}</span>
        </Card>
        <Card backgroundColor="bg-sky-500">
          <span>Total Orders</span>
          <span className="">{totalOrders}</span>
        </Card>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 bg-white p-3 border rounded shadow-md h-[300px]">
          <h6 className="text-red-900">Income Trends</h6>
          <LineChart
            series={[
              {
                data: [...lineData],
              },
            ]}
            xAxis={[
              {
                scaleType: "band",
                data: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
              },
            ]}
            height={290}
            grid={{ vertical: true, horizontal: true }}
          />
        </div>
        <div className="flex-1 flex gap-4">
          <div className="flex-1 bg-white border rounded shadow-md p-2">
            <h4>Expenses</h4>
            <h6>{formater.format(totalCurrentMonthExpenses)}</h6>
            <p>{percentComparison}% more than last month</p>
            {/*<MyPieChart
              last={totalLastMonthExpenses}
              current={totalCurrentMonthExpenses}
              lastName={lastMonthName}
              currentName={currentMonthName}
				/>*/}
            {/* <PieGraph outer={70} inner={50} /> */}
          </div>
          <div className="flex-1 bg-white border rounded shadow-md p-2">
            <h5>Transactions</h5>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col flex-1 h-72 bg-white shadow-md p-2 mb-4 rounded">
          <h6>Account Balance</h6>
          <TableWrapper style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>SN</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Balance</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              <TableBodyRow>
                <TableBodyCell>1</TableBodyCell>
                <TableBodyCell>Income </TableBodyCell>
                <TableBodyCell>46,585,556</TableBodyCell>
              </TableBodyRow>
              <TableBodyRow>
                <TableBodyCell>1</TableBodyCell>
                <TableBodyCell>Purchase </TableBodyCell>
                <TableBodyCell>46,585,556</TableBodyCell>
              </TableBodyRow>
            </tbody>
          </TableWrapper>
        </div>
        <div className="flex-1 shadow-md bg-white mb-4 p-2 rounded">
          <h6>Customer Demographic</h6>
          {/* <div style={{ width: "300px", height: "300px" }}>
          <MapChart data={data} />
        </div> */}
        </div>
      </div>
    </div>
  );
};

const TableWrapper = styled.table``;
const TableHeaderCell = styled.th`
  padding: 10px;
  color: #fff;
  text-align: left;
`;
const TableBodyCell = styled.td`
  padding: 10px;
`;
const TableHeaderRow = styled.tr`
  background-color: #656281;
`;
const TableBodyRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const Summary = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  grid-column: 1/3;
  grid-row: 5/7;
  padding: 20px;
`;
const Table = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  padding: 20px;
  grid-column: 3/5;
  grid-row: 5/7;
`;

export default Dashboard;
