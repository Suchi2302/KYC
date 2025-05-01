// services/api.ts
import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = 'https://kyc-hxkh.onrender.com/'; // Change this to your actual backend API URL

export const fetchData = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/dashboard-data`);
  return res.data;
};

export const updateCustomerStatus = async (customerId, status) => {
  return axios.post(`${API_BASE_URL}/api/customers/${customerId}/status`, { customerId, status });
};

export const postAlert = async (customerId, message) => {
  return axios.post(`${API_BASE_URL}/alerts`, { customerId, message });
};

// API call to fetch customers
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/customers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers", error);
    throw error;
  }
};

// API call to create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/customers`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating customer", error);
    throw error;
  }
};

