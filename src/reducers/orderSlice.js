import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orders: [],
  status: "idle",
  error: null,
  filters: {
    nameSearch: "",
    date: "today",
    currentPage: 1,
    itemsPerPage: 10,
  },
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (query) => {
    const { currentPage, itemsPerPage } = query;
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/orders/all/?page=${currentPage}&limit=${itemsPerPage}`
    );
    return response.data;
  }
);

export const addOrder = createAsyncThunk("orders/addOrder", async (order) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/orders`,
    order
  );
  return response.data;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setNameSearch: (state, action) => {
      state.filters.nameSearch = action.payload;
    },
    setDateFilter: (state, action) => {
      state.filters.date = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.orders.push(action.payload?.data);
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setDateFilter, setNameSearch } = ordersSlice.actions;
export default ordersSlice.reducer;
