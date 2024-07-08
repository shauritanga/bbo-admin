import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { add } from "date-fns";

const initialState = {
  reports: [],
  status: "idle",
  error: null,
  filters: {
    title: "",
  },
};

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async () => {
    const response = await axios.get(
      "https://api.alphafunds.co.tz/api/v1/reports"
    );
    return response.data;
  }
);

export const addReport = createAsyncThunk(
  "reports/addReport",
  async (report) => {
    const response = await axios.post(
      "https://api.alphafunds.co.tz/api/v1/emails/send-report-email",
      report
    );
    return response.data;
  }
);

export const deleteReport = createAsyncThunk(
  "reports/deleteReport",
  async (reportId) => {
    await axios.delete(
      `https://api.alphafunds.co.tz/api/v1/reports/${reportId}`
    );
    return reportId;
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.filters.title = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reports.push(action.payload);
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(
          (report) => report._id !== action.payload
        );
      });
  },
});

export const { setTitle } = reportsSlice.actions;

export default reportsSlice.reducer;
