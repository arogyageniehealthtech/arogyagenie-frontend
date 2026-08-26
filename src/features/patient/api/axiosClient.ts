// src/api/axiosClient.ts
import axios from 'axios';

// Create a centralized axios instance
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
//   process.env.REACT_APP_API_URL 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Interceptor for attaching auth tokens to requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('AccessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling global responses/errors (e.g., auto-logout on 401)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., clear local storage, redirect to login)
      console.warn('Unauthorized access - please log in again.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;