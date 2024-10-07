import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredReports: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // Filtering reports by search term and date range
    FILTER_REPORTS(state, action) {
      const { reports, search, startDate, endDate } = action.payload;
      const searchLower = search.toLowerCase();

      const tempReports = reports.filter((report) => {
        const reportDate = new Date(report.date);
        const isWithinDateRange =
          (!startDate || reportDate >= new Date(startDate)) &&
          (!endDate || reportDate <= new Date(endDate));

        const managerName = report.managerName?.toLowerCase() || "";
        const storeName = report.storeName?.toLowerCase() || "";
        const productsString = Object.keys(report.products || {})
          .join(", ")
          .toLowerCase();

        return (
          isWithinDateRange &&
          (managerName.includes(searchLower) ||
            storeName.includes(searchLower) ||
            productsString.includes(searchLower))
        );
      });

      state.filteredReports = tempReports;
    },
  },
});

export const { FILTER_REPORTS } = filterSlice.actions;

export const selectFilteredReports = (state) => state.filter.filteredReports;

export default filterSlice.reducer;
