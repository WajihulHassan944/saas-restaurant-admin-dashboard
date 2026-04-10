import axios from "axios";
import { baseURL } from "./constants";

const api = axios.create({
  baseURL,
});

// ---------------- REQUEST INTERCEPTOR ----------------
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth");

    if (stored) {
      const parsed = JSON.parse(stored);
      const accessToken = parsed?.accessToken;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  }

  return config;
});

// ---------------- RESPONSE INTERCEPTOR ----------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const stored = localStorage.getItem("auth");
        if (!stored) throw new Error("No auth");

        const parsed = JSON.parse(stored);
        const refreshToken = parsed?.refreshToken;

        if (!refreshToken) throw new Error("No refresh token");

        // 🔁 refresh token call
        const res = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const newData = res.data?.data;

        // ✅ save new tokens
        localStorage.setItem("auth", JSON.stringify(newData));

        // ✅ update header and retry request
        originalRequest.headers.Authorization = `Bearer ${newData.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        // ❌ logout if refresh fails
        localStorage.removeItem("auth");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;