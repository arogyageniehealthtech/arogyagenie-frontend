import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosError } from "axios";

// Normalize and resolve the API Base URL from environment variables or production fallback
const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://arogyagenie-backend-1.onrender.com/api/v1";

let cleanedBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");
if (!cleanedBaseUrl.endsWith("/api/v1")) {
  if (cleanedBaseUrl.endsWith("/api")) {
    cleanedBaseUrl = `${cleanedBaseUrl}/v1`;
  } else {
    cleanedBaseUrl = `${cleanedBaseUrl}/api/v1`;
  }
}

export const API_BASE_URL = cleanedBaseUrl;

// Create central Axios instance with credentials enabled for cookies
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://arogyagenie-backend-1.onrender.com/api/v1",
  timeout: 60000, // 60s to accommodate Render cold-starts and queue processing
  withCredentials: true, // Allows cross-origin authentication cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to normalize URLs and inject Authorization token securely
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Sanitize redundant leading /api/v1 or /api if baseURL already contains it
    if (config.url) {
      if (config.url.startsWith("/api/v1/")) {
        config.url = config.url.replace(/^\/api\/v1/, "");
      } else if (config.url.startsWith("/api/v1")) {
        config.url = config.url.replace(/^\/api\/v1/, "");
      } else if (config.url.startsWith("/api/")) {
        config.url = config.url.replace(/^\/api/, "");
      }
    }

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

// Response interceptor to handle common errors and log safe diagnostic telemetry
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem("AccessToken");
      }
    } else if (error.request) {
      // Network Error or CORS preflight failure
      console.warn("[API Network/CORS Error]", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method?.toUpperCase(),
        code: error.code,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;