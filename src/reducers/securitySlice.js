import { axiosInstance } from "@/utils/axiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  securities: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    query: "", // Search query
    counter: "10",
    dateRange: null, // [startDate, endDate] (optional)
  },
};

export const fetchSecurities = createAsyncThunk(
  "securities/fetchSecurities",
  async () => {
    const response = await axiosInstance.get(`/securities`);
    return response.data; // Assuming your API returns an array of orders
  }
);

export const addSecurity = createAsyncThunk(
  "securities/addSecurity",
  async (security) => {
    const response = await axiosInstance.post(`/securities`, security);
    return response.data; // Assuming your backend returns the new order
  }
);

const securitiesSlice = createSlice({
  name: "securities",
  initialState,
  reducers: {
    setQueryFilter(state, action) {
      state.filters.query = action.payload;
    },
    setCounterFilter(state, action) {
      state.filters.counter = action.payload;
    },
    // Add other reducers for filtering, sorting, etc. later
    updateSecurity(state, action) {
      const { id, updates } = action.payload;
      const existingSecurity = state.securities.find((sec) => sec.id === id);
      if (existingSecurity) {
        Object.assign(existingSecurity, updates);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSecurities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSecurities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.securities = action.payload;
      })
      .addCase(fetchSecurities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addSecurity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addSecurity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.securities.push(action.payload);
      })
      .addCase(addSecurity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setQueryFilter, setCounterFilter, updateSecurity } =
  securitiesSlice.actions; // Add actions later if needed
export default securitiesSlice.reducer;
