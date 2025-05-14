"use server";

import { axiosInstance } from "@/api";
import { createLoginFormData } from "@/app/loginPage/page";
import { cookies } from "next/headers";

export interface IResponseLogin {
    access_token: string;
    refresh_token: string;
}

export async function postLoginForm(
    params: createLoginFormData
): Promise<boolean | Error> {
    try {
        const response = await axiosInstance.post<IResponseLogin>(
            "/auth/login",
            params
        );
        const cookiesStore = await cookies();
        cookiesStore.set("access_token", response.data.access_token, {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });
        cookiesStore.set("refresh_token", response.data.refresh_token, {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        });

        console.log(params);
        console.log(response.data);
        return true;
    } catch (error) {
        return error as Error;
    }
}
