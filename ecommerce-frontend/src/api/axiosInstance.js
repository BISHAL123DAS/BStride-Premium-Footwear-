import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends cookies (JWT token)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
