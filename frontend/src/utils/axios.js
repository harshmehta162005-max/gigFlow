import axios from "axios";

// Automatically switches URL based on environment
const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api" // Local Backend
  : "https://gigflow-l0e1.onrender.com/api"; // Live Backend

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Critical for Cookies
});

export default api;