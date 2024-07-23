import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  dealings: [],
  status: "idle",
  error: null,
  filters: {
    search: "",
  },
};

export const fetchDealings = createAsyncThunk(
  "dealings/fetchDealings",
  async (query) => {
    const { currentPage, itemsPerPage } = query;
    const response = await axios.get(
      `${
        import.meta.env.VITE_BASE_URL
      }/orders/dealing?page=${currentPage}&limit=${itemsPerPage}`
    );
    console.log(response);
    return response.data;
  }
);

const dealingSlice = createSlice({
  name: "dealings",
  initialState,
  reducers: {
    // Add reducers for filtering, sorting, etc. if needed
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDealings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDealings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dealings = action.payload;
      })
      .addCase(fetchDealings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Handle the error message
      });
  },
});

export const { setSearchFilter } = dealingSlice.actions;

export default dealingSlice.reducer;
