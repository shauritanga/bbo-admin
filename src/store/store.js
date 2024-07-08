import { configureStore } from "@reduxjs/toolkit";
import securityReducer from "../reducers/securitySlice.js";
import financialYearReducer from "../reducers/financialYearSlice.js";
import roleRuducer from "../reducers/roleSlice.js";
import employeeReducer from "../reducers/employeeSlice.js";
import reportReducer from "../reducers/reportSlice.js";
import categoryReducer from "../reducers/categorySlice.js";
import dealingReducer from "../reducers/dealingSlice.js";
import orderReducer from "../reducers/orderSlice.js";
import executionReducer from "../reducers/executionSlice.js";

export default configureStore({
  reducer: {
    securities: securityReducer,
    financialYears: financialYearReducer,
    employees: employeeReducer,
    roles: roleRuducer,
    reports: reportReducer,
    categories: categoryReducer,
    dealings: dealingReducer,
    orders: orderReducer,
    executions: executionReducer,
  },
});
