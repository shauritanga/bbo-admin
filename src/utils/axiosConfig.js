// axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

const setupAxiosInterceptors = (navigate) => {
  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      const newToken = response.headers["authorization"];
      if (newToken) {
        localStorage.setItem("token", newToken.split(" ")[1]);
      }
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem("token"); // Remove token if it expires
        navigate("/login"); // Redirect to login on session expiration
      }
      return Promise.reject(error);
    }
  );

  // Add a request interceptor to attach the token to each request
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export { axiosInstance, setupAxiosInterceptors };
