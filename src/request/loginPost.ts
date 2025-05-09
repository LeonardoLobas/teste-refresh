"use server";

import { axiosInstance } from "@/api";
import { createLoginFormData } from "@/app/loginPage/page";

export async function postLoginForm(params: createLoginFormData) {
    try {
        const response = await axiosInstance.post("/auth/login", params);
        return response;
    } catch (error) {
        return error;
    }
}
