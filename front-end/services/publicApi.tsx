import axios from "axios";

const publicApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for debugging
publicApi.interceptors.request.use(
    (config) => {
        console.log(`[publicApi] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error("[publicApi] Request error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor for debugging
publicApi.interceptors.response.use(
    (response) => {
        console.log(`[publicApi] Response ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error("[publicApi] Response error:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            message: error.message,
            code: error.code,
            errno: error.errno,
            data: error.response?.data,
            baseURL: error.config?.baseURL,
        });
        return Promise.reject(error);
    }
);

export default publicApi;
