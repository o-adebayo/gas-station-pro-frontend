import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";
import { toast } from "react-toastify";

const initialState = {
  report: null,
  reports: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ",",
};

// Create New Report
export const createReport = createAsyncThunk(
  "reports/create",
  async (formData, thunkAPI) => {
    try {
      return await reportService.createReport(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get All Reports
// We are not sending any form data
// the end point will just return all reports based on the user that is logged
export const getReports = createAsyncThunk(
  "reports/getAll",
  async (_, thunkAPI) => {
    try {
      return await reportService.getReports();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a Report
// we will pass the id as a parameter
/* export const deleteReport = createAsyncThunk(
  "reports/delete",
  async (id, thunkAPI) => {
    try {
      return await reportService.deleteReport(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
); */
export const deleteReport = createAsyncThunk(
  "reports/delete",
  async ({ id, deleteCode }, thunkAPI) => {
    try {
      // Pass both id and deleteCode to the service function
      return await reportService.deleteReport({ id, deleteCode });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get a single Report
// pass the id as a parameter
// the end point will just return all reports based on the user that is logged
export const getReport = createAsyncThunk(
  "reports/getReport",
  async (id, thunkAPI) => {
    try {
      return await reportService.getReport(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update a single Report
export const updateReport = createAsyncThunk(
  "reports/updateReport",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await reportService.updateReport(id, formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    /*  CALC_STORE_VALUE(state, action) {
      console.log("store value");
    }, */
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        console.log(action.payload);
        state.reports.push(action.payload);
        toast.success("Report added successfully");
      })
      .addCase(createReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        //console.log(action.payload);
        state.reports.push(action.payload);
        state.reports = action.payload;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        //console.log(action.payload);
        toast.success(
          "Sales Report and associated images deleted successfully"
        );
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // set our report state to the information we get back from the payload
        // which is just the single report and all its data
        state.report = action.payload;
      })
      .addCase(getReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // Update the specific report in the reports array
        const index = state.reports.findIndex(
          (report) => report._id === action.payload._id
        );
        if (index !== -1) {
          state.reports[index] = action.payload; // Update the state with the new report data
        }
        toast.success("Report updated successfully");
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

//export const { CALC_STORE_VALUE } = reportSlice.actions;

export const selectIsLoading = (state) => state.report.isLoading;
export const selectReport = (state) => state.report.report;

export default reportSlice.reducer;
