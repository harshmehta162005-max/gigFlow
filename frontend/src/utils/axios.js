import axios from 'axios';

// URL Setup
const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "https://gigflow-l0e1.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  // ❌ REMOVED: withCredentials: true (Not needed for Headers)
});

// ✅ INTERCEPTOR: This is the magic part
// It automatically adds the token to every request
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  
  if (userInfo) {
    // We try to parse the JSON safely
    try {
      const parsedUser = JSON.parse(userInfo);
      // If we find a token, we attach it to the header
      if (parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    } catch (error) {
      console.error("Error parsing user info:", error);
    }
  }
  return config;
});

export default api;