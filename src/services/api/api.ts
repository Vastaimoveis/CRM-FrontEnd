import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const apiNoInterceptor = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token && !config.url?.includes("/auth/login")) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/refresh") ||
            originalRequest.url?.includes("/auth/login")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }

            return Promise.reject(error);
        }

        try {
            const response = await apiNoInterceptor.post(
                "/auth/refresh",
                { refreshToken }
            );

            const newAccessToken = response.data.data;

            if (!newAccessToken) {
                throw new Error("Token de acesso não retornado.");
            }

            localStorage.setItem("accessToken", newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }

            return Promise.reject(refreshError);
        }
    }
);