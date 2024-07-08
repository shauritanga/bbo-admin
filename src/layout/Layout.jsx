import React, { useCallback, useEffect, useState } from "react";
import Footer from "../footer/Footer";
import Navbar from "../header/Header";
import { Outlet } from "react-router";
import "./layout.css";

import { useLocation, Navigate } from "react-router-dom";

import Sidebar from "../sidebar/Sidebar";
import { useAuth } from "../provider/AuthProvider";

const Layout = () => {
  const [isActive, setIsActive] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("theme") || "light"
  );
  const { pathname, search } = useLocation();
  const { user } = useAuth();

  const userObject = typeof user === "string" ? JSON.parse(user) : user;

  if (userObject === null) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    setIsActive(pathname + search);
  }, [pathname, search]);

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
    document.body.setAttribute("dark-theme", theme);
  }, [theme]);

  return (
    <div className="layout">
      {/* <div className="left"> */}
      {isSidebarOpen && (
        <Sidebar
          isActive={isActive}
          user={userObject}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      {/* </div> */}
      <div className="right">
        <Navbar
          user={userObject}
          theme={theme}
          setTheme={setTheme}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
