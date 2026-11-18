import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function isAuthenticated(request: NextRequest) {
    const token = request.cookies.get("session")?.value;
    const secret = process.env.SESSION_SECRET;

    if (!token || !secret) return false;

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret),
            { algorithms: ["HS256"] }
        );

        return !!payload.sub;
    } catch {
        return false;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authenticated = await isAuthenticated(request);

    // Already authenticated? Don't show the login page.
    if (pathname === "/login") {
        if (authenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    }

    // Not authenticated? Send them to login.
    if (!authenticated) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("session");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};