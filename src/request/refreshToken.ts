import { axiosInstance } from "@/api";
import { NextResponse } from "next/server";

export async function tryRefreshToken(requestUrl: string) {
    try {
        const response = await axiosInstance.post("/auth/refresh");

        const newAccessToken = response.data.accessToken;

        // Define o novo cookie de access_token
        const responseToReturn = NextResponse.next();
        responseToReturn.cookies.set("access_token", newAccessToken, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 15, // 15 minutos
        });

        return responseToReturn;
    } catch (err) {
        console.log(err);
        // Se falhar, redireciona para login
        return NextResponse.redirect(new URL("/loginPage", requestUrl));
    }
}
