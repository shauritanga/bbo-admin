import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Register from "../../register/Register";
import Otp from "../otp/Otp";
import PasswordReset from "../reset/PasswordReset";
import RequestPassword from "../request/RequesrPassword";
import Expense from "../expense/Expense";
import Payment from "../payments/Payment";
import Receipt from "../receipt/Receipt";
import AccountingReports from "../reports/AccountingReports";
import Transaction from "../transaction/Transaction";
import Business from "../business/Business";
import Category from "../category/Category";
import Customers from "../customers/Customers";
import Dashboard from "../dashboard/Dashboard";
import DealingSheet from "../dealing/DealingSheet";
import DealingView from "@/views/dealing/DealingView";
import CustomerView from "@/views/customer/Customer";
import Department from "../department/Department";
import Employee from "../employee/Employee";
import EmployeeView from "@/views/employee/EmployeeView";
import Files from "../files/Files";
import Orders from "../orders/Orders";
import OrderView from "@/views/order/Order";
import MarketReports from "../reports/MarketReports";
import HumanResource from "../resources/HumanResource";
import Role from "../role/Role";
import Security from "../security/Security";
import TransactionView from "@/views/transaction/TransactionView";
import PrintContractPDF from "@/components/pdf/PrintContractPDF";
import PDF from "@/components/pdf/PDF";
import PrivateRoute from "@/components/protected";
import Layout from "@/layout/Layout";
import { useEffect } from "react";
import AuthProvider from "@/provider/AuthProvider";
import { setupAxiosInterceptors } from "@/utils/axiosConfig";

const AppContent = () => {
  const navigate = useNavigate(); //

  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Register />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/reset-password-request" element={<RequestPassword />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/accounting/expenses" element={<Expense />} />
            <Route path="/accounting/payments" element={<Payment />} />
            <Route path="/accounting/receipts" element={<Receipt />} />
            <Route path="/accounting/reports" element={<AccountingReports />} />
            <Route path="/accounting/transactions" element={<Transaction />} />
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
    </>
  );
};

export default AppContent;
