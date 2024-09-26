import { axiosInstance } from "@/utils/axiosConfig";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  roles: [],
  status: "idle",
  error: null,
};

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const response = await axiosInstance.get(`/roles`);
  return response.data;
});

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {} = rolesSlice.actions;
export default rolesSlice.reducer;
