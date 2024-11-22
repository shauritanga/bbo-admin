import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/utils/axiosConfig";
import { filterFns } from "@tanstack/react-table";
import { Folder } from "lucide-react";
import React, { useEffect, useState } from "react";

function Files() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axiosInstance.get("/customers");
      setCustomers(response.data);
    };
    fetchUsers();
  }, []);

  const filterCustomers = customers?.filter((customer) =>
    customer.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div className="w-full flex justify-between shadow-md bg-white my-8 p-5 items-center ">
        <span className="flex">{customers.length} customers</span>
        <Input
          className="w-[320px]"
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search customer"
        />
      </div>
      <div className="grid grid-cols-9 gap-4">
        {filterCustomers.length === 0 ? (
          <div className="w-full flex items-center justify-center col-span-9">
            No such customers
          </div>
        ) : (
          filterCustomers?.map((customer) => (
            <span className="w-full flex-col items-center justify-center inline-flex bg-white shadow-md p-12 gap-2">
              <Folder />
              {`${customer.name.split(" ")[0]}  ${customer.name.split(" ")[2]}`}
            </span>
          ))
        )}
      </div>
    </>
  );
}

export default Files;
