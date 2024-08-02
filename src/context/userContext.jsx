import axios from "axios";
import React, { createContext, useContext } from "react";
import useSWR from "swr";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const DataProvider = ({ children, customerId }) => {
  const { data, error } = useSWR(
    [
      `${import.meta.env.VITE_BASE_URL}/profiles/${customerId}`,
      `${import.meta.env.VITE_BASE_URL}/transactions/${customerId}`,
      `${import.meta.env.VITE_BASE_URL}/executions/${customerId}`,
    ],
    async (urls) => {
      const [profile, transactions, executions] = await Promise.all(
        urls.map((url) => fetcher(url))
      );
      return { profile, transactions, executions };
    }
  );

  if (error) return <div>Error loading data:{error.message}</div>;
  if (!data) return <div>Loading...</div>;
  const { profile, transactions, executions } = data;

  return (
    <DataContext.Provider value={{ profile, transactions, executions }}>
      {children}
    </DataContext.Provider>
  );
};
