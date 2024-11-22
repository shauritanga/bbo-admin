import { axiosInstance } from "@/utils/axiosConfig";
import axios from "axios";
import React, { createContext, useContext } from "react";
import useSWR from "swr";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export const DataProvider = ({ children, customerId }) => {
  const { data, error } = useSWR(
    [`/transactions/${customerId}`, `/executions/clients/${customerId}`],
    async (urls) => {
      const [transactions, executions] = await Promise.all(
        urls.map((url) => fetcher(url))
      );
      return { transactions, executions };
    }
  );

  if (error) return <div>Error loading data:{error.message}</div>;
  if (!data) return <div>Loading</div>;
  const { transactions, executions } = data;

  return (
    <DataContext.Provider value={{ transactions, executions }}>
      {children}
    </DataContext.Provider>
  );
};
