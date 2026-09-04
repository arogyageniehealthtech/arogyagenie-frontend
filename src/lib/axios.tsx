import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosError } from "axios";

// Create central Axios instance with credentials enabled for cookies
export const axiosInstance: AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1/",
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://arogyagenie-backend-1.onrender.com/api/v1/",
  timeout: 60000,
  withCredentials: true, // <-- CRITICAL: Allows cookies to be sent and received cross-origin
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject Authorization token securely (if using Bearer tokens alongside cookies)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("AccessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set the correct multipart boundary for FormData uploads
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem("AccessToken");
        // window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;