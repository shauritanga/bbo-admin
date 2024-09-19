import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import { ReceiptDataTable } from "@/components/receipt/table";

function Receipt() {
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState("");
  const [receipts, setReceipts] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const updatePayment = async (selected, status) => {
    for (let item in selected) {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/receipts/${selected[item]._id}`,
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
        }
      );
      const json = await response.json();
    }
  };

  const exportToExcel = async () => {
    try {
      const data = receipts;

      //xlsx
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "Receipts.xlsx");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/receipts/all`
        );
        const data = await response.json();
        setReceipts(data); // Assuming API returns { items: [...], totalPages: ... }
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const customersResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/customers`
        );
        if (!customersResponse.ok) throw new Error("Error fetching customers");

        const customersData = await customersResponse.json();
        setClients(customersData);
      } catch (err) {}
    };
    fetchData();
  }, []);

  if (!clients) {
    return;
  }

  if (!receipts) {
    return <div>Loading...</div>;
  }

  const receiptTableData = receipts?.map((receipt) => {
    const payee = clients.filter((client) => client._id === receipt.userId)[0];
    return {
      id: receipt?.uid ?? "",
      name: payee?.name,
      status: receipt.status,
      amount: receipt.amount,
      date: receipt.transactionDate,
      description: receipt.description,
    };
  });

  return (
    <div className="flex flex-col gap-4 my-4">
      <ReceiptDataTable
        customers={receiptTableData}
        open={openForm}
        setOpenForm={setOpenForm}
      />
    </div>
  );
}

export default Receipt;
