import axios, { AxiosError } from "axios";

import { cookies } from "next/headers";
import { IResponseLogin } from "./request/loginPost";

export const axiosInstance = axios.create({
    baseURL: process.env.API_ROUTE,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    console.log(token);
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const status = error.status;
        const route = error.config?.url;
        const cookieStore = await cookies();
        const notRefreshing = ["/auth/login", "/auth/refresh"];
        let retryRefresh = false;

        if (
            status === 401 &&
            !notRefreshing.includes(route ?? "") &&
            !retryRefresh
        ) {
            retryRefresh = true;
            const refreshToken = cookieStore.get("refresh_token")?.value;
            try {
                const { data } = await axiosInstance.post<IResponseLogin>(
                    "/auth/refresh",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );
                if (data.access_token && data.refresh_token) {
                    cookieStore.set("access_token", data.access_token, {
                        secure: true,
                        httpOnly: true,
                        sameSite: "strict",
                    });
                    cookieStore.set("refresh_token", data.refresh_token, {
                        secure: true,
                        httpOnly: true,
                        sameSite: "strict",
                    });
                    if (error.config) {
                        error.config.headers.Authorization = `Bearer ${data.access_token}`;
                        return axiosInstance.request(error.config);
                    }
                }
            } catch {
                cookieStore.delete("refresh_token");
                return Promise.reject("REFRESH_ERROR");
            }
        }
    }
);
