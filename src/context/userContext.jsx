import axios from "axios";
import React, { createContext, useContext } from "react";
import useSWR from "swr";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const DataProvider = ({ children, customerId }) => {
  const { data, error } = useSWR(
    [
      `${import.meta.env.VITE_BASE_URL}/transactions/${customerId}`,
      `${import.meta.env.VITE_BASE_URL}/executions/${customerId}`,
      `${import.meta.env.VITE_BASE_URL}/statements/${customerId}`,
      `${import.meta.env.VITE_BASE_URL}/statements/${customerId}`,
    ],
    async (urls) => {
      const [transactions, executions, statements] = await Promise.all(
        urls.map((url) => fetcher(url))
      );
      return { transactions, executions, statements };
    }
  );

  if (error) return <div>Error loading data:{error.message}</div>;
  if (!data) return <div>Loading...</div>;
  const { transactions, executions, statements } = data;

  return (
    <DataContext.Provider value={{ transactions, executions, statements }}>
      {children}
    </DataContext.Provider>
  );
};
