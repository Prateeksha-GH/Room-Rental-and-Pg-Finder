// Central Axios instance: attaches JWT, normalizes errors, points at VITE_API_URL.
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Inject access token from localStorage on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rn_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, drop the token so the UI bounces the user back to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("rn_token");
      localStorage.removeItem("rn_user");
    }
    return Promise.reject(err);
  }
);

export default api;
