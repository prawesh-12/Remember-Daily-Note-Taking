import axios from "axios";
import { clearAuthSession, getAuthToken } from "./auth";

const BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5001/api"
        : "/api";

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuthSession();

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    },
);

export default api;
