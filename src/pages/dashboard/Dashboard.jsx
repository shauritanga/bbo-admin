import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { FiShoppingBag } from "react-icons/fi";
import { VscServerProcess } from "react-icons/vsc";
import { IoCheckmarkDoneCircleOutline, IoTimerOutline } from "react-icons/io5";
import { TiCancelOutline } from "react-icons/ti";
import styled from "styled-components";
import { LineChart } from "@mui/x-charts";
import MyPieChart from "../../components/pie/trial";
import axios from "axios";
import { getMonthName } from "../../utils/getMonthName";
import { useAuth } from "../../provider/AuthProvider";
import { RotatingLines } from "react-loader-spinner";

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
const summary = [
  {
    name: "Receivable",
    total: 0,
    icon: <IoCheckmarkDoneCircleOutline style={{ "font-size": "1.8rem" }} />,
    percent: 0,
  },
  {
    name: "Revenue",
    total: "76,800,432.85",
    icon: <VscServerProcess style={{ "font-size": "1.8rem" }} />,
    percent: 7,
  },
  {
    name: "Expenses",
    total: "50,780,589.87",
    icon: <TiCancelOutline style={{ "font-size": "1.8rem" }} />,
    percent: 22,
  },
  {
    name: "Profit",
    total: "14,490,500.43",
    icon: <FiShoppingBag style={{ "font-size": "1.8rem" }} />,
    percent: 3,
  },
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
  const [incomes, setIncomes] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [orders, setOrders] = useState(null);
  const { user } = useAuth();

  const userObject = typeof user === "string" ? JSON.parse(user) : user;

  let formater = Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          incomeResponse,
          expenseResponse,
          customerResponse,
          orderResponse,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/brokerage`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/expenses/all`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/customers`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/orders`),
        ]);

        if (incomeResponse.status !== 200) {
          throw new Error("failed to fetch incomes");
        }

        if (expenseResponse.status !== 200) {
          throw new Error("failed to fetch epenses");
        }
        if (customerResponse.status !== 200) {
          throw new Error("failed to fetch customers");
        }
        if (orderResponse.status !== 200) {
          throw new Erroe("Failed to fetch orders");
        }

        setIncomes(incomeResponse.data);
        setCustomers(customerResponse.data);
        setExpenses(expenseResponse.data);
        setOrders(orderResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  if (
    incomes === null ||
    customers === null ||
    expenses === null ||
    orders === null
  ) {
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
  ).length;

  const totalOrders = orders.length;
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
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

  const totalLastMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfLastMonth && expenseDate < endOfLastMonth;
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalCurrentMonthExpenses = expenses
    .filter((expense) => {
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
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfJanuary && expenseDate < endOfJanuary;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //02 January
  const startOfFebruary = new Date(today.getFullYear(), 1, 1);
  const endOfFebruary = new Date(today.getFullYear(), 2, 0, 23.59, 59);
  const totalFebruaryExpenses = incomes
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfFebruary && expenseDate < endOfFebruary;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //03 March
  const startOfMarch = new Date(today.getFullYear(), 2, 1);
  const endOfMarch = new Date(today.getFullYear(), 3, 0, 23.59, 59);
  const totalMarchExpenses = incomes
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMarch && expenseDate < endOfMarch;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //04 April
  const startOfApril = new Date(today.getFullYear(), 3, 1);
  const endOfApril = new Date(today.getFullYear(), 4, 0, 23.59, 59);
  const totalAprilExpenses = incomes
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfApril && expenseDate < endOfApril;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //05 May
  const startOfMay = new Date(today.getFullYear(), 4, 1);
  const endOfMay = new Date(today.getFullYear(), 5, 0, 23.59, 59);
  const totalMayExpenses = incomes
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMay && expenseDate < endOfMay;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //06 June
  const startOfJune = new Date(today.getFullYear(), 5, 1);
  const endOfJune = new Date(today.getFullYear(), 6, 0, 23.59, 59);
  const totalJuneExpenses = incomes
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfJune && expenseDate < endOfJune;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //07 July
  const startOfJuly = new Date(today.getFullYear(), 6, 1);
  const endOfJuly = new Date(today.getFullYear(), 7, 0, 23.59, 59);
  const totalJulyExpenses = incomes
    .filter((expense) => {
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
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfOctober && expenseDate < endOfOctober;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //11 November
  const startOfNovember = new Date(today.getFullYear(), 10, 1);
  const endOfNovember = new Date(today.getFullYear(), 11, 0, 23.59, 59);
  const totalNovemberExpenses = incomes
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfNovember && expenseDate < endOfNovember;
    })
    .reduce((acc, curr) => acc + curr.value, 0);

  //12 December
  const startOfDecember = new Date(today.getFullYear(), 11, 1);
  const endOfDecember = new Date(today.getFullYear(), 12, 0, 23.59, 59);
  const totalDecemberExpenses = incomes
    .filter((expense) => {
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
    <>
      {staff.role?.name !== "admin" ? (
        <div>normal dashboard coming soon</div>
      ) : (
        <Wrapper>
          <Card
            style={{
              backgroundColor: "#000",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "1rem" }}>Current Income</span>
            <span style={{ fontSize: "1.3rem" }}>
              {formater.format(totalIncome)}
            </span>
          </Card>
          <Card
            style={{
              backgroundColor: "#323365",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "1rem" }}>Current Customers</span>
            <span style={{ fontSize: "1.2rem" }}>{customers.length}</span>
          </Card>
          <Card
            style={{
              backgroundColor: "#e71f27",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "1rem" }}>Active Customers</span>
            <span style={{ fontSize: "1.2rem" }}>
              {`${activeCustomers / customers.length} %`}
            </span>
          </Card>
          <Card
            style={{
              backgroundColor: "#656281",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "1rem" }}>Total Orders</span>
            <span style={{ fontSize: "1.2rem" }}>{totalOrders}</span>
          </Card>
          <Graph>
            <h6>Income Trends</h6>
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
              //height={400}
              grid={{ vertical: true, horizontal: true }}
            />
          </Graph>
          <Pie>
            <h4>Expenses</h4>
            <h6>{formater.format(totalCurrentMonthExpenses)}</h6>
            <p>{percentComparison}% more than last month</p>
            <MyPieChart
              last={totalLastMonthExpenses}
              current={totalCurrentMonthExpenses}
              lastName={lastMonthName}
              currentName={currentMonthName}
            />
            {/* <PieGraph outer={70} inner={50} /> */}
          </Pie>
          <Transaction>
            <h5>Transactions</h5>
          </Transaction>
          <Summary>
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
          </Summary>
          <Table>
            <h6>Customer Demographic</h6>
            {/* <div style={{ width: "300px", height: "300px" }}>
          <MapChart data={data} />
        </div> */}
          </Table>
        </Wrapper>
      )}
    </>
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

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  grid-template-rows: repeat(6, minmax(80px, 100px));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  padding: 20px;
`;

const Graph = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  padding: 20px;
  grid-column: 1/3;
  grid-row: 2/5;
`;
const Pie = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  padding: 20px;
  grid-column: 3/4;
  grid-row: 2/5;
`;
const Transaction = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  grid-column: 4/5;
  grid-row: 2/5;
  padding: 20px;
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
