import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;

    const protectedRoutes = ["/homePage"];

    if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL("/loginPage", request.url));
    }
    return NextResponse.next();
}

export const config = { matcher: ["/homePage"] };
