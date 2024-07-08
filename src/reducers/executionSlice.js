import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  executions: [],
  status: "idle",
  error: null,
};

export const fetchExecutions = createAsyncThunk(
  "executions/fetchExecutions",
  async (id) => {
    const response = await axios.get(
      `https://api.alphafunds.co.tz/api/v1/executions?customerId=${id}`
    );
    return response.data;
  }
);

const executionsSlice = createSlice({
  name: "executions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExecutions.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchExecutions.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.executions = action.payload;
    });
    builder.addCase(fetchExecutions.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export const {} = executionsSlice.actions;
export default executionsSlice.reducer;
