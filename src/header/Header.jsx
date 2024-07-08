import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import "./header.css";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { LuSearch } from "react-icons/lu";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import LoginUser from "../components/user/LoginUser";

function Header({ user, theme, setTheme, isSidebarOpen, setIsSidebarOpen }) {
  return (
    <div className="header">
      <div className="logo">
        <HiOutlineMenuAlt2
          className="header-icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <h3>ALPHA CAPITAL</h3>
      </div>
      <div className="links">
        {theme === "light" ? (
          <MdOutlineDarkMode
            className="header-icon"
            onClick={() => setTheme("dark")}
          />
        ) : (
          <MdOutlineLightMode
            className="header-icon"
            onClick={() => setTheme("light")}
          />
        )}
        <LuSearch className="header-icon" />
        <div className="notify">
          <IoMdNotificationsOutline className="header-icon" />
          <span>4</span>
        </div>
        <div className="user">
          <div className="user-name">
            <h3>{user.name}</h3>
            <span className="text-muted">
              {user.role?.name === "admin" ? "Admin" : "Normal"}
            </span>
          </div>
          <LoginUser />
        </div>
      </div>
    </div>
  );
}

export default Header;
