import React, { useState, useEffect } from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import { Navigate } from "react-router";
import Orders from "./pages/orders/Orders";
import DealingSheet from "./pages/dealing/DealingSheet";
import Reports from "./pages/reports/AccountingReports";
import Assets from "./pages/assets/Assets";
import Customers from "./pages/customers/Customers";
import Files from "./pages/files/Files";
import Messages from "./pages/message/Messages";
import Receipt from "./pages/receipt/Receipt";
import Expense from "./pages/expense/Expense";
import Transaction from "./pages/transaction/Transaction";
import Payment from "./pages/payments/Payment";
import Role from "./pages/role/Role";
import Employee from "./pages/employee/Employee";
import Security from "./pages/security/Security";
import Business from "./pages/business/Business";
import { useNavigate } from "react-router";
import HumanResource from "./pages/resources/HumanResource";
import Department from "./pages/department/Department";
import PDF from "./components/pdf/PDF";
import CustomerView from "./views/customer/Customer";
import OrderView from "./views/order/Order";
import Register from "./register/Register";
import AuthProvider from "./provider/AuthProvider";
import DealingView from "./views/dealing/DealingView";
import TransactionView from "./views/transaction/TransactionView";
import EmployeeView from "./views/employee/EmployeeView";
import AccountingReports from "./pages/reports/AccountingReports";
import MarketReports from "./pages/reports/MarketReports";
import Category from "./pages/category/Category";
import Otp from "./pages/otp/Otp";
import PrintContractPDF from "./components/pdf/PrintContractPDF";
import PasswordReset from "./pages/reset/PasswordReset";
import RequestPassword from "./pages/request/RequesrPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="login" element={<Register />} />
            <Route path="/otp" element={<Otp />} />
            <Route
              path="/reset-password-request"
              element={<RequestPassword />}
            />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
              <Route path="/customers/:customerId" element={<CustomerView />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dealing" element={<DealingSheet />} />
              <Route path="/dealing/:dealingId" element={<DealingView />} />
              <Route path="/departments" element={<Department />} />
              <Route path="/employees" element={<Employee />} />
              <Route path="/employees/:employeeId" element={<EmployeeView />} />
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
        </AuthProvider>
      </BrowserRouter>
      )
    </>
  );
}

export default App;
