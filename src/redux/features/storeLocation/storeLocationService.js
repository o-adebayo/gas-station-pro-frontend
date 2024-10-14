import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/stores/`;

// Create New Store Location
const createStoreLocation = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data;
};

// Get all Store Locations
const getStoreLocations = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

// Delete a Store Location
const deleteStoreLocation = async (id) => {
  const response = await axios.delete(API_URL + id);
  return response.data.message;
};
// Get a Store Location
const getStoreLocation = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};
// Get the store associated with the logged-in user
/* const getStoreByUserId = async () => {
  const response = await axios.get(`${API_URL}/user-store`);
  return response.data;
}; */
// Update Store Location
const updateStoreLocation = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData);
  return response.data;
};

// update Store manager
const updateStoreLocationManager = async (formData) => {
  const response = await axios.post(API_URL + "updateStoreManager", formData);
  return response.data;
};

const storeLocationService = {
  createStoreLocation,
  getStoreLocations,
  getStoreLocation,
  deleteStoreLocation,
  updateStoreLocation,
  updateStoreLocationManager,
  //getStoreByUserId,
};

export default storeLocationService;
