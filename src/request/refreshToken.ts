import { axiosInstance } from "@/api";
import { cookies } from "next/headers";

export async function refreshAccessToken(): Promise<string | null> {
    try {
        const refresh_token = (await cookies()).get("refresh_token");
        if (!refresh_token) {
            return null;
        }

        const response = await axiosInstance.post<{ access_token: string }>(
            "/auth/refresh",
            { refresh_token }
        );

        const cookiesStore = cookies();
        (await cookiesStore).set("access_token", response.data.access_token, {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });

        return response.data.access_token;
    } catch (error) {
        console.error("Refresh token failed:", error);
        return null;
    }
}
axiosInstance.interceptors.request.use(
    async (config) => {
        const access_token = (await cookies()).get("access_token");

        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                originalRequest.headers["Authorization"] =
                    `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);
