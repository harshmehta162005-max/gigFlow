import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000/api"
  : "https://gigflow-l0e1.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsedUser = JSON.parse(userInfo);
    if (parsedUser.token) {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }
  return config;
});

export default api;