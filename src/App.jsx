import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";
import AuthProvider from "./provider/AuthProvider";
import { RotatingLines } from "react-loader-spinner";
import "rsuite/dist/rsuite.min.css";
import AppContent from "./pages/app";

/*
const AccountingReports = lazy(() =>
  import("./pages/reports/AccountingReports")
);
const Business = lazy(() => import("./pages/business/Business"));
const Category = lazy(() => import("./pages/category/Category"));
const Customers = lazy(() => import("./pages/customers/Customers"));
const CustomerView = lazy(() => import("./views/customer/CustomeView"));
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
*/

function App() {
  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;
