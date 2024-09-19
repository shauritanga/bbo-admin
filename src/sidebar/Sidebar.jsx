import React from "react";
import { RxDashboard } from "react-icons/rx";
import { Link } from "react-router-dom";
import CollapseButton from "../components/collapse/CollapseButton";
import {
  MdChevronLeft,
  MdOutlineAccountBalanceWallet,
  MdOutlineFolder,
  MdOutlineSell,
  MdWebAsset,
} from "react-icons/md";
import { GoDot } from "react-icons/go";
import { BiSpreadsheet } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { FaRegMessage } from "react-icons/fa6";
import { LuLayoutList } from "react-icons/lu";
import { GrResources } from "react-icons/gr";
import "./sidebar.css";
import { SlPeople } from "react-icons/sl";
import { BsShieldLock } from "react-icons/bs";
import { HiOutlineSquaresPlus } from "react-icons/hi2";

const Sidebar = ({ isActive, user, isSidebarOpen, setIsSidebarOpen }) => {
  const customersPath = new RegExp(`^customers(\/.*)?$`);
  const ordersPath = new RegExp(`^orders(\/.*)?$`);

  return (
    <div className="flex flex-col gap-4 w-[200px] h-screen bg-white p-2">
      <div className="flex justify-between close">
        <span>ALPHACAPITAL</span>
        <span onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <MdChevronLeft size={25} />
        </span>
      </div>
      <Link
        onClick={() => console.log("dashboard clicked")}
        to="/dashboard"
        className={`flex items-center gap-2 item ${
          isActive === "/dashboard" ? "active" : ""
        }`}
      >
        <RxDashboard />
        <span>Dashboard</span>
      </Link>
      <CollapseButton
        icon={<MdOutlineSell />}
        name="Orders"
        className=" flex items-center gap-2 item"
      >
        <div>
          <Link
            to="/orders/?q=all"
            className={`flex items-center gap-2 item ${
              isActive === "/orders/?q=all" ? "active" : ""
            }`}
          >
            <GoDot />
            <span>All orders</span>
          </Link>
          <Link
            to="/orders/?q=pending"
            className={`flex items-center gap-2 item ${
              isActive === "/orders/?q=pending" ? "active" : ""
            }`}
          >
            <GoDot />
            <span>Pending</span>
          </Link>
          <Link
            to="/orders/?q=complete"
            className={`flex items-center gap-2 item ${
              isActive === "/orders/?q=complete" ? "active" : ""
            }`}
          >
            <GoDot />
            <span>Complete</span>
          </Link>
          <Link
            to="/orders/?q=cancelled"
            className={`flex items-center gap-2 item ${
              isActive === "/orders/?q=cancelled" ? "active" : ""
            }`}
          >
            <GoDot />
            <span>Cancelled</span>
          </Link>
        </div>
      </CollapseButton>
      <Link
        to="/dealing"
        className={`flex items-center gap-2 item ${
          isActive === "/dealing" ? "active" : ""
        }`}
      >
        <BiSpreadsheet />
        <span>Dealing sheet</span>
      </Link>
      <Link
        to="/reports"
        className={`flex items-center gap-2 item ${
          isActive === "/reports" ? "active" : ""
        }`}
      >
        <TbReport />
        <span>Market Reports</span>
      </Link>
      <CollapseButton icon={<SlPeople />} name="CRM">
        <>
          <Link
            to="/customers"
            className={`flex items-center gap-2 item ${
              isActive === "/customers" ? "active" : ""
            }`}
          >
            <GoDot />
            <span>Customers</span>
          </Link>
          <Link
            to="/categories"
            className={`flex items-center gap-2 item ${
              isActive === "/categories" ? "active" : ""
            }`}
          >
            <GoDot />
            <span>Categories</span>
          </Link>
        </>
      </CollapseButton>

      <Link
        to="/files"
        className={`flex items-center gap-2 item ${
          isActive === "/files" ? "active" : ""
        }`}
      >
        <MdOutlineFolder />
        <span>File Manager</span>
      </Link>
      {
        <>
          <CollapseButton
            icon={<MdOutlineAccountBalanceWallet />}
            name="Accounting"
            className="flex items-center gap-2 item"
          >
            <div>
              <Link
                to="/accounting/transactions"
                className={`flex items-center gap-2 item ${
                  isActive === "/transactions" ? "active" : ""
                }`}
              >
                <GoDot />
                <span>Transactions</span>
              </Link>
              <Link
                to="/accounting/expenses"
                className={`flex items-center gap-2 item ${
                  isActive === "/expenses" ? "active" : ""
                }`}
              >
                <GoDot />
                <span>Expenses</span>
              </Link>
              <Link
                to="/accounting/payments"
                className={`flex items-center gap-2 item ${
                  isActive === "/payments" ? "active" : ""
                }`}
              >
                <GoDot />
                <span>Payments</span>
              </Link>
              <Link
                to="/accounting/receipts"
                className={`flex items-center gap-2 item ${
                  isActive === "/receipts" ? "active" : ""
                }`}
              >
                <GoDot />
                <span>Receipts</span>
              </Link>
              <Link
                to="/accounting/reports"
                className={`flex items-center gap-2 item ${
                  isActive === "/reports" ? "active" : ""
                }`}
              >
                <GoDot />
                <span>Reports</span>
              </Link>
            </div>
          </CollapseButton>
          <CollapseButton icon={<GrResources />} name="Human Resources">
            <div>
              <Link
                to="/employees"
                className={`flex items-center gap-2 item ${
                  isActive === "/employees" ? "active" : ""
                }`}
              >
                <GoDot />
                <span>Employees</span>
              </Link>
            </div>
          </CollapseButton>
          <Link
            to="/securities"
            className={`flex items-center gap-2 item ${
              isActive === "/securities" ? "active" : ""
            }`}
          >
            <BsShieldLock />
            <span>Securities</span>
          </Link>
          <Link
            to="/business"
            className={`flex items-center gap-2 item ${
              isActive === "/business" ? "active" : ""
            }`}
          >
            <MdOutlineAccountBalanceWallet />
            <span>Business</span>
          </Link>
          <Link
            to="/roles"
            className={`flex items-center gap-2 item ${
              isActive === "/roles" ? "active" : ""
            }`}
          >
            <HiOutlineSquaresPlus />
            <span>Roles</span>
          </Link>
        </>
      }
    </div>
  );
};

export default Sidebar;
