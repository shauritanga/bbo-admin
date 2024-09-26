import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";
import AuthProvider from "./provider/AuthProvider";
import { RotatingLines } from "react-loader-spinner";
import "rsuite/dist/rsuite.min.css";
import AppContent from "./pages/app";

const AccountingReports = lazy(() =>
  import("./pages/reports/AccountingReports")
);
const Business = lazy(() => import("./pages/business/Business"));
const Category = lazy(() => import("./pages/category/Category"));
const Customers = lazy(() => import("./pages/customers/Customers"));
const CustomerView = lazy(() => import("./views/customer/Customer"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const DealingSheet = lazy(() => import("./pages/dealing/DealingSheet"));
const DealingView = lazy(() => import("./views/dealing/DealingView"));
const Department = lazy(() => import("./pages/department/Department"));
const Employee = lazy(() => import("./pages/employee/Employee"));
const EmployeeView = lazy(() => import("./views/employee/EmployeeView"));
const Expense = lazy(() => import("./pages/expense/Expense"));
const Files = lazy(() => import("./pages/files/Files"));
const HumanResource = lazy(() => import("./pages/resources/HumanResource"));
const Layout = lazy(() => import("./layout/Layout"));
const MarketReports = lazy(() => import("./pages/reports/MarketReports"));
const Register = lazy(() => import("./register/Register"));
const OrderView = lazy(() => import("./views/order/Order"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const Otp = lazy(() => import("./pages/otp/Otp"));
const PasswordReset = lazy(() => import("./pages/reset/PasswordReset"));
const Payment = lazy(() => import("./pages/payments/Payment"));
const PDF = lazy(() => import("./components/pdf/PDF"));
const PrintContractPDF = lazy(() =>
  import("./components/pdf/PrintContractPDF")
);
const Receipt = lazy(() => import("./pages/receipt/Receipt"));
const RequestPassword = lazy(() => import("./pages/request/RequesrPassword"));
const Role = lazy(() => import("./pages/role/Role"));
const Security = lazy(() => import("./pages/security/Security"));
const Transaction = lazy(() => import("./pages/transaction/Transaction"));
const TransactionView = lazy(() =>
  import("./views/transaction/TransactionView")
);

function App() {
  return (
    <>
      <Router>
        {/* <Suspense
            fallback={
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
            }
          >
            <Routes>
              <Route path="login" element={<Register />} />
              <Route path="/otp" element={<Otp />} />
              <Route
                path="/reset-password-request"
                element={<RequestPassword />}
              />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/accounting/expenses" element={<Expense />} />
                <Route path="/accounting/payments" element={<Payment />} />
                <Route path="/accounting/receipts" element={<Receipt />} />
                <Route
                  path="/accounting/reports"
                  element={<AccountingReports />}
                />
                <Route
                  path="/accounting/transactions"
                  element={<Transaction />}
                />
                <Route path="/business" element={<Business />} />
                <Route path="/categories" element={<Category />} />
                <Route path="/customers" element={<Customers />} />
                <Route
                  path="/customers/:customerId"
                  element={<CustomerView />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dealing" element={<DealingSheet />} />
                <Route path="/dealing/:dealingId" element={<DealingView />} />
                <Route path="/departments" element={<Department />} />
                <Route path="/employees" element={<Employee />} />
                <Route
                  path="/employees/:employeeId"
                  element={<EmployeeView />}
                />
                <Route path="/files" element={<Files />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderView />} />
                <Route path="/reports" element={<MarketReports />} />
                <Route path="/resources" element={<HumanResource />} />
                <Route path="/roles" element={<Role />} />
                <Route
                  path="/securities"
                  element={<Security backgroundColor="var(--color-white)" />}
                />
                <Route
                  path="/transactions/:transactionId"
                  element={<TransactionView />}
                />
              </Route>
              <Route path="/contract" element={<PrintContractPDF />} />
              <Route path="/statement" element={<PDF />} />
            </Routes>
          </Suspense> */}
        <AppContent />
      </Router>
    </>
  );
}

export default App;
