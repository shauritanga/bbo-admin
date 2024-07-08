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
    <div className="aside">
      <div className="close">
        <span>ALPHACAPITAL</span>
        <span onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <MdChevronLeft size={25} />
        </span>
      </div>
      <Link
        onClick={() => console.log("dashboard clicked")}
        to="/dashboard"
        className={`item ${isActive === "/dashboard" ? "active" : ""}`}
      >
        <RxDashboard />
        <span>Dashboard</span>
      </Link>
      <CollapseButton icon={<MdOutlineSell />} name="Orders" className="item">
        <div>
          <Link
            to="/orders/?q=all"
            className={`item ${isActive === "/orders/?q=all" ? "active" : ""}`}
          >
            <GoDot />
            <span>All orders</span>
          </Link>
          <Link
            to="/orders/?q=pending"
            className={`item ${
              isActive === "/orders/?q=pending" ? "active" : ""
            }`}
          >
            <GoDot />
            <span>Pending</span>
          </Link>
          <Link
            to="/orders/?q=complete"
            className={`item ${
              isActive === "/orders/?q=complete" ? "active" : ""
            }`}
          >
            <GoDot />
            <span>Complete</span>
          </Link>
          <Link
            to="/orders/?q=cancelled"
            className={`item ${
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
        className={`item ${isActive === "/dealing" ? "active" : ""}`}
      >
        <BiSpreadsheet />
        <span>Dealing sheet</span>
      </Link>
      <Link
        to="/reports"
        className={`item ${isActive === "/reports" ? "active" : ""}`}
      >
        <TbReport />
        <span>Market Reports</span>
      </Link>
      {/* <Link
        to="/assets"
        className={`item ${isActive === "/assets" ? "active" : ""}`}
      >
        <MdWebAsset />
        <span>Asset Management</span>
      </Link> */}
      <CollapseButton icon={<SlPeople />} name="CRM">
        <>
          <Link
            to="/customers"
            className={`item ${isActive === "/customers" ? "active" : ""}`}
          >
            <GoDot />
            <span>Customers</span>
          </Link>
          <Link
            to="/categories"
            className={`item ${isActive === "/categories" ? "active" : ""}`}
          >
            <GoDot />
            <span>Categories</span>
          </Link>
        </>
      </CollapseButton>

      <Link
        to="/files"
        className={`item ${isActive === "/files" ? "active" : ""}`}
      >
        <MdOutlineFolder />
        <span>File Manager</span>
      </Link>

      {user.role?.name === "admin" && (
        <>
          <CollapseButton
            icon={<MdOutlineAccountBalanceWallet />}
            name="Accounting"
            className="item"
          >
            <div>
              <Link
                to="/accounting/transactions"
                className={`item ${
                  isActive === "/transactions" ? "active" : ""
                }`}
              >
                <GoDot />
                <span>Transactions</span>
              </Link>
              <Link
                to="/accounting/expenses"
                className={`item ${isActive === "/expenses" ? "active" : ""}`}
              >
                <GoDot />
                <span>Expenses</span>
              </Link>
              <Link
                to="/accounting/payments"
                className={`item ${isActive === "/payments" ? "active" : ""}`}
              >
                <GoDot />
                <span>Payments</span>
              </Link>
              <Link
                to="/accounting/receipts"
                className={`item ${isActive === "/receipts" ? "active" : ""}`}
              >
                <GoDot />
                <span>Receipts</span>
              </Link>
              <Link
                to="/accounting/reports"
                className={`item ${isActive === "/reports" ? "active" : ""}`}
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
                className={`item ${isActive === "/employees" ? "active" : ""}`}
              >
                <GoDot />
                <span>Employees</span>
              </Link>
              {/* <Link
                to="/departments"
                className={`item ${
                  isActive === "/departments" ? "active" : ""
                }`}
              >
                <GoDot />
                <span>Departments</span>
              </Link> */}
            </div>
          </CollapseButton>
          <Link
            to="/securities"
            className={`item ${isActive === "/securities" ? "active" : ""}`}
          >
            <BsShieldLock />
            <span>Securities</span>
          </Link>
          <Link
            to="/business"
            className={`item ${isActive === "/business" ? "active" : ""}`}
          >
            <MdOutlineAccountBalanceWallet />
            <span>Business</span>
          </Link>
          <Link
            to="/roles"
            className={`item ${isActive === "/roles" ? "active" : ""}`}
          >
            <HiOutlineSquaresPlus />
            <span>Roles</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;
