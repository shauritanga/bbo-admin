import { useLocation, useNavigate } from "react-router-dom";
import CustomerView from "./CustomeView";
import { DataProvider } from "@/context/userContext";
const CustomerWrapper = () => {
  const { state } = useLocation();
  const customer = state.customer;
  return (
    <DataProvider customerId={customer._id}>
      <CustomerView customer={customer} />
    </DataProvider>
  );
};

export default CustomerWrapper;
