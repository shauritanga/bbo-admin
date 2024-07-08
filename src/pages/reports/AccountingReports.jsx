import React, { useState } from "react";
import styled from "styled-components";
import IncomeReport from "../../components/reports/IncomeReport";
import ExpenssesReport from "../../components/reports/ExpensesReport";
import DESReport from "../../components/reports/DSEReport";
import CSDRReport from "../../components/reports/CSDRReport";
import ReceiptReport from "../../components/reports/ReceiptReport";
import PaymentReport from "../../components/reports/PaymentReport";
import VATReport from "../../components/reports/VATReport";
import FidelityReport from "../../components/reports/FidelityReport";
import CMSAReport from "../../components/reports/CMSAReport";

function AccountingReports() {
  const [activeTab, setActiveTab] = useState("income");

  return (
    <Wrapper>
      <Navbar>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "income" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "income"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("income")}
        >
          Income Report
        </NavItem>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "payments" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "payments"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("payments")}
        >
          Payments Report
        </NavItem>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "expenses" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "expenses"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses Report
        </NavItem>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "receipts" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "receipts"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("receipts")}
        >
          Receipts Report
        </NavItem>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "vat" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "vat"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("vat")}
        >
          VAT Report
        </NavItem>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "dse" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "dse"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("dse")}
        >
          DSE Report
        </NavItem>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "csdr" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "csdr"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("csdr")}
        >
          CSDR Report
        </NavItem>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "fidelity" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "fidelity"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("fidelity")}
        >
          FIDELITY Report
        </NavItem>
        <NavItem
          style={{
            backgroundColor:
              activeTab === "cmsa" ? "hsl(243, 50%, 21%)" : "transparent",
            color:
              activeTab === "cmsa"
                ? "hsl(209, 61%, 100%)"
                : "hsl(209, 61%, 16%)",
          }}
          onClick={() => setActiveTab("cmsa")}
        >
          CMSA Report
        </NavItem>
      </Navbar>
      <Content>
        {activeTab === "income" && <IncomeReport />}
        {activeTab === "payments" && <PaymentReport />}
        {activeTab === "expenses" && <ExpenssesReport />}
        {activeTab === "receipts" && <ReceiptReport />}
        {activeTab === "vat" && <VATReport />}
        {activeTab === "dse" && <DESReport />}
        {activeTab === "csdr" && <CSDRReport />}
        {activeTab === "fidelity" && <FidelityReport />}
        {activeTab === "cmsa" && <CMSAReport />}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
`;
const Navbar = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
`;
const NavItem = styled.div`
  cursor: pointer;
  padding: 6px 20px;
  font-size: 0.9rem;
  color: hsl(209, 61%, 16%);
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.03);
  }
`;
const Content = styled.div``;

export default AccountingReports;
