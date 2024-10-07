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
const deleteReport = async (id) => {
  const response = await axios.delete(API_URL + id);
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

const reportService = {
  createReport,
  getReports,
  deleteReport,
  getReport,
  updateReport,
};

export default reportService;
