import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-l0e1.onrender.com/api",
  withCredentials: true,
});

export default api;
