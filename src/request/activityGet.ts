"use server";
import { axiosInstance } from "@/api";

export interface IActivityGet {
    id: number;
    name: string;
}

export async function activityGet(): Promise<IActivityGet[] | unknown> {
    try {
        const response =
            await axiosInstance.get<IActivityGet[]>("/activity/find-all");

        return response.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
