import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Endpoints that should never carry auth tokens or trigger refresh logic
const PUBLIC_ENDPOINTS = [
  "/accounts/register/",
  "/accounts/login/",
  "/accounts/token/refresh/",
  "/applicants/apply/",
  "/applicants/upload-document/"
];

function isPublicRequest(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((ep) => url.includes(ep));
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach JWT access token ─────────────────
api.interceptors.request.use(
  (config) => {
    // Skip auth headers for public endpoints
    if (isPublicRequest(config.url)) return config;

    if (typeof window !== "undefined") {
      const tokens = localStorage.getItem("tokens");
      if (tokens) {
        const { access } = JSON.parse(tokens);
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: auto-refresh on 401 ───────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never attempt token refresh for public endpoints — just surface the error
    if (isPublicRequest(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem("tokens");
        if (!tokens) throw new Error("No tokens");

        const { refresh } = JSON.parse(tokens);
        const { data } = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
          refresh,
        });

        // Store new tokens
        const newTokens = { access: data.access, refresh: data.refresh || refresh };
        localStorage.setItem("tokens", JSON.stringify(newTokens));

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch {
        // Refresh failed — clear and redirect to login
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
