import axios from 'axios';

const api = axios.create({
  // Use the environment variable or fallback to localhost
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api" 
    : "https://gigflow-l0e1.onrender.com/api",
  withCredentials: true, // Important since you use cookies/CORS
});

// Request interceptor to add the Token to headers
api.interceptors.request.use(
  (config) => {
    // 1. Get userInfo from localStorage (assuming you store it there)
    const userInfo = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null;

    // 2. If token exists, attach it to headers
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;