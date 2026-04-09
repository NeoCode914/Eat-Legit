import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { LS_TOKEN_KEY, LS_AUTH_KEY } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attaches the JWT token from localStorage to every outgoing request.

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(LS_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handles 401 Unauthorized by clearing local storage and redirecting to login.

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(LS_TOKEN_KEY);
      localStorage.removeItem(LS_AUTH_KEY);
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
