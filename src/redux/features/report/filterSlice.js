import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredReports: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_REPORTS(state, action) {
      const {
        reports,
        search = "", // Default to an empty string if search is undefined
        startDate,
        endDate,
        storeName = "",
        managerName = "",
        reportId = "",
      } = action.payload;

      // Ensure reports exist and are an array
      if (!reports || !Array.isArray(reports)) {
        state.filteredReports = [];
        return;
      }

      // Normalize the search term for partial matching
      const searchLower = search.toLowerCase();

      const tempReports = reports.filter((report) => {
        const reportDate = new Date(report.date);

        // Check if the report is within the date range
        const isWithinDateRange =
          (!startDate || reportDate >= new Date(startDate)) &&
          (!endDate || reportDate <= new Date(endDate));

        // Check for exact match for store name and manager name (dropdown values)
        const isStoreNameMatch = !storeName || report.storeName === storeName;
        const isManagerNameMatch =
          !managerName || report.managerName === managerName;

        // Convert report._id to string for report ID filtering
        const reportIdString = report._id?.toString() || "";
        const isReportIdMatch = !reportId || reportIdString === reportId;

        // Free-text search: partial matching for fields (name, preparedBy, products)
        const managerNameLower = report.managerName?.toLowerCase() || "";
        const storeNameLower = report.storeName?.toLowerCase() || "";
        const preparedByLower = report.preparedBy?.name?.toLowerCase() || ""; // Assuming preparedBy contains user object with a name field
        const productsString = Object.keys(report.products || {})
          .join(", ")
          .toLowerCase();

        const isFreeTextMatch =
          managerNameLower.includes(searchLower) ||
          storeNameLower.includes(searchLower) ||
          preparedByLower.includes(searchLower) ||
          productsString.includes(searchLower);

        // Apply all the filters: exact matches for dropdowns and partial for search
        return (
          isWithinDateRange &&
          isStoreNameMatch &&
          isManagerNameMatch &&
          isReportIdMatch &&
          (searchLower === "" || isFreeTextMatch)
        );
      });

      state.filteredReports = tempReports;
    },
  },
});

export const { FILTER_REPORTS } = filterSlice.actions;

export const selectFilteredReports = (state) => state.filter.filteredReports;

export default filterSlice.reducer;
