import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import { ReceiptDataTable } from "@/components/receipt/table";
import { axiosInstance } from "@/utils/axiosConfig";

function Receipt() {
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState("");
  const [receipts, setReceipts] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const updatePayment = async (selected, status) => {
    for (let item in selected) {
      const response = await axiosInstance.patch(
        `${import.meta.env.VITE_BASE_URL}/receipts/${selected[item]._id}`,
        JSON.stringify(status)
      );
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
        const response = await setReceipts(response.data); // Assuming API returns { items: [...], totalPages: ... }
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
        const response = await Promise.all([
          axiosInstance.get(`transactions/receipts`),
          axiosInstance.get(`/customers`),
        ]);
        setReceipts(response[0].data);
        setClients(response[1].data);
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

  console.log(receipts);

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
        customers={receipts}
        open={openForm}
        setOpenForm={setOpenForm}
      />
    </div>
  );
}

export default Receipt;
