import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { role?: string };
    } catch {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Ignore /api/auth routes
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    const sessionToken = req.cookies.get('session')?.value;

    // Protect /dashboard routes: redirect to login if no session
    if (pathname.startsWith('/dashboard') && !sessionToken) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/dashboard') && sessionToken) {
        const payload = await verifyToken(sessionToken);

        if (!payload || !payload.role) {
            // Invalid token or no role, redirect to login
            const loginUrl = new URL('/login', req.url);
            return NextResponse.redirect(loginUrl);
        }

        const userRole = payload.role.toLowerCase();

        // Redirect if trying to access wrong dashboard section
        if (pathname.startsWith('/dashboard/client') && userRole === 'admin') {
            return NextResponse.redirect(new URL('/dashboard/admin', req.url));
        }

        if (pathname.startsWith('/dashboard/admin') && userRole === 'client') {
            return NextResponse.redirect(new URL('/dashboard/client', req.url));
        }

        // If path starts with /dashboard but next segment is NOT the role, inject role in URL
        const pathParts = pathname.split('/').filter(Boolean); // removes empty string

        if (
            pathParts[0] === 'dashboard' &&
            pathParts[1] !== userRole // either missing or different role segment
        ) {
            // build new URL with role inserted after dashboard
            const newPathname = ['/dashboard', userRole, ...pathParts.slice(1)].join('/');
            return NextResponse.redirect(new URL(newPathname, req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*'],
};
