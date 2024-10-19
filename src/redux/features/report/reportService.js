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

// Helper function to build query parameters
const buildQueryParams = (params) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      query.append(key, params[key]);
    }
  });
  return query.toString();
};

// Service function for fetching detailed sales reports with query params
const getDetailedSalesReports = async (params) => {
  const queryParams = buildQueryParams(params); // Convert params into query string
  const response = await axios.get(
    `${API_URL}/detailed-sales-report?${queryParams}`
  ); // Attach query string to API URL
  return response.data;
};

const reportService = {
  createReport,
  getReports,
  deleteReport,
  getReport,
  updateReport,
  getDetailedSalesReports,
};

export default reportService;
