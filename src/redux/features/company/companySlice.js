import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyService from "./companyService";
import { toast } from "react-toastify";

const initialState = {
  company: null,
  companies: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create New Company
export const createCompany = createAsyncThunk(
  "companies/create",
  async (formData, thunkAPI) => {
    try {
      return await companyService.createCompany(formData);
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

// Get all Companies
export const fetchCompanies = createAsyncThunk(
  "companies/getAll",
  async (_, thunkAPI) => {
    try {
      return await companyService.getCompanies();
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

// Get a Company by ID
export const getCompany = createAsyncThunk(
  "companies/getCompany",
  async (id, thunkAPI) => {
    try {
      return await companyService.getCompany(id);
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

// Get a Company by Code
export const getCompanyByCode = createAsyncThunk(
  "companies/getCompanyByCode",
  async (companyCode, thunkAPI) => {
    try {
      return await companyService.getCompanyByCode(companyCode);
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

// Update a Company
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await companyService.updateCompany(id, formData);
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

// Delete a Company
export const deleteCompany = createAsyncThunk(
  "companies/delete",
  async (id, thunkAPI) => {
    try {
      return await companyService.deleteCompany(id);
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

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    RESET(state) {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.companies.push(action.payload);
        toast.success("Company created successfully. Please check your email.");
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.company = action.payload;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // get company by code
      .addCase(getCompanyByCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompanyByCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.company = action.payload;
      })
      .addCase(getCompanyByCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Company updated successfully";
        toast.success("Company updated successfully");
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Company deleted successfully";
        toast.success("Company deleted successfully");
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { RESET } = companySlice.actions;

export const selectIsLoading = (state) => state.company.isLoading;
export const selectCompany = (state) => state.company.company;
export const selectCompanies = (state) => state.company.companies;

export default companySlice.reducer;
