import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8081"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    // 🔥 NÃO envia token no login
    if (
        token &&
        config.url !== "/auth/login"
    ) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});