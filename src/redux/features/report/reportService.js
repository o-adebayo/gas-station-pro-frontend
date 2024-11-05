import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/reports/`;

// Create New Report
const createReport = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data;
};

// Get All Reports
const getReports = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Delete a Report
// we need to add a id to the URL when we want to delete
/* const deleteReport = async (id) => {
  const response = await axios.delete(API_URL + id);
  return response.data;
};
 */
// Delete report service function
// Delete a Report with deleteCode
// Delete a Report with deleteCode
const deleteReport = async ({ id, deleteCode }) => {
  // Send the deleteCode as part of the headers or query params
  const response = await axios.delete(`${API_URL}${id}`, {
    headers: {
      "Content-Type": "application/json", // Specify JSON as the content type
    },
    data: { deleteCode }, // Include the deleteCode in the request body as 'data'
  });
  console.log(response);

  return response.data;
};

// Get a single Report by its ID
const getReport = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Get all reports for a specific store by its storeId
const getReportsByStoreId = async (storeId) => {
  const response = await axios.get(`${API_URL}store/${storeId}`);
  return response.data;
};

// Update a single Report by its ID
// we need the id of the product and the formData we are sending back to save
// Update a single Report by its ID
const updateReport = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData, {
    headers: {
      "Content-Type": "application/json", // Specify JSON as the content type
    },
  });
  return response.data;
};

// Service function for fetching detailed sales reports with query params
const getDetailedSalesReports = async ({ page, pageSize, sort, search }) => {
  const response = await axios.get(API_URL + "detailed-sales-report", {
    params: {
      page,
      pageSize,
      sort,
      search,
    },
    paramsSerializer: (params) => {
      // Serialize parameters so Axios encodes them correctly
      return new URLSearchParams(params).toString();
    },
  });
  //console.log("page is", page);
  return response.data; // Return the API response data
};

// Import stores via CSV file
const importReports = async (formData) => {
  const response = await axios.post(`${API_URL}import-reports`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure multipart content type
    },
  });
  return response.data;
};

const reportService = {
  createReport,
  getReports,
  deleteReport,
  getReport,
  updateReport,
  getDetailedSalesReports,
  getReportsByStoreId,
  importReports,
};

export default reportService;
