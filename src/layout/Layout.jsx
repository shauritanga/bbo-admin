import React, { useCallback, useEffect, useState } from "react";
import Footer from "../footer/Footer";
import Navbar from "../header/Header";
import { Outlet } from "react-router";
import "./layout.css";
import { jwtDecode } from "jwt-decode";

import { useLocation, Navigate } from "react-router-dom";

import Sidebar from "../sidebar/Sidebar";
import { useAuth } from "../provider/AuthProvider";
import styled from "styled-components";

const Layout = () => {
  const [isActive, setIsActive] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("theme") || "light"
  );
  const { pathname, search } = useLocation();

  useEffect(() => {
    setIsActive(pathname + search);
  }, [pathname, search]);

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
    document.body.setAttribute("dark-theme", theme);
  }, [theme]);

  return (
    <div className=" flex w-screen h-screen">
      {isSidebarOpen && (
        <Sidebar
          isActive={isActive}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}

      <div className="right">
        <Navbar
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

const Wrapper = styled.div`
  display: grid;
`;

export default Layout;
