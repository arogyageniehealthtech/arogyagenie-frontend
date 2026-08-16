import axios from "axios";
import type { InternalAxiosRequestConfig , AxiosInstance,AxiosError } from "axios";

// Create central Axios instance with a blank base URL (or relative path /api)
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "", // Empty string means it targets your local domain/mock handlers
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject Authorization token securely
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;