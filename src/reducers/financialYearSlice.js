import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { set } from "date-fns";

const initialState = {
  financialYears: [],
  status: "idle",
  error: null,
  filters: {
    counter: "5",
    query: "",
  },
};

export const fetchFinancialYears = createAsyncThunk(
  "financialYears/fetchFinancialYears",
  async () => {
    const response = await axios.get(
      "https://api.alphafunds.co.tz/api/v1/financial-years"
    );
    return response.data;
  }
);
export const addFinancialYear = createAsyncThunk(
  "financialYears/addFinancialYear",
  async (financialYear) => {
    const response = await axios.post(
      "https://api.alphafunds.co.tz/api/v1/financial-years",
      financialYear
    );
    return response.data;
  }
);
export const deleteFinancialYear = createAsyncThunk(
  "financialYears/deleteFinancialYear",
  async (financialYearId) => {
    const response = await axios.delete(
      `https://api.alphafunds.co.tz/api/v1/financial-years/${financialYearId}`
    );
    return response.data;
  }
);

const financialYearSlice = createSlice({
  name: "financialYears",
  initialState,
  reducers: {
    setQuerry: (state, action) => {
      state.filters.query = action.payload;
    },
    setCounter: (state, action) => {
      state.filters.counter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialYears.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFinancialYears.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.financialYears = action.payload;
      })
      .addCase(fetchFinancialYears.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addFinancialYear.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFinancialYear.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.financialYears.push(action.payload);
      })
      .addCase(addFinancialYear.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteFinancialYear.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFinancialYear.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteFinancialYear.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.financialYears = state.financialYears.filter(
          (financialYear) => financialYear._id !== action.payload._id
        );
      });
  },
});

export const { setQuerry, setCounter } = financialYearSlice.actions;
export default financialYearSlice.reducer;
