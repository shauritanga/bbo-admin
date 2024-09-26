import { axiosInstance } from "@/utils/axiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  employees: [],
  status: "idle",
  error: null,
  filters: {
    search: "",
    counter: "10",
  },
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await axiosInstance.get(`/employees`);
    return response.data;
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setCounter: (state, action) => {
      state.filters.counter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCounter, setSearch } = employeesSlice.actions;
export default employeesSlice.reducer;
