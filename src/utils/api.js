import axios from "axios";
import { store } from "../app/store";
import { logout, refreshSucceeded } from "../features/auth/authSlice";
import { original } from "@reduxjs/toolkit";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// attach access token on each request
api.interceptors.request.use((config) => {
  const token =
    store.getState().auth.accessToken || localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

const flushQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

// refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const publicPaths = ["/auth/login", "/auth/register", "/auth/refresh"];
    const isPublic = publicPaths.some((path) => original.url.includes(path));

    // If it's a public route, just reject without refresh handling
    if (isPublic) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken =
          store.getState().auth.refreshToken ||
          localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem("accessToken", data.accessToken);
        store.dispatch(refreshSucceeded(data.accessToken));
        flushQueue(null, data.accessToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        flushQueue(e, null);
        store.dispatch(logout());
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
