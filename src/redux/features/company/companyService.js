import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/companies/`;

// Create New Company
const createCompany = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data;
};

// Get all Companies
const getCompanies = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a Company
const getCompany = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Update a Company
const updateCompany = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData);
  return response.data;
};

// Delete a Company
const deleteCompany = async (id) => {
  const response = await axios.delete(API_URL + id);
  return response.data.message;
};

const companyService = {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};

export default companyService;
