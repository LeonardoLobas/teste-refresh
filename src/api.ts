import axios from "axios";
import { cookies } from "next/headers";

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
