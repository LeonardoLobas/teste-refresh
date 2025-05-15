import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const protectedRoutes = ["/homePage"];

    const isProtected = protectedRoutes.includes(request.nextUrl.pathname);

    if (isProtected && !accessToken && !refreshToken) {
        return NextResponse.redirect(new URL("/loginPage", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/homePage"],
};
