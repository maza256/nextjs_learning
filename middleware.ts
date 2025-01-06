// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
//
// export default NextAuth(authConfig).auth;
//
// export const config = {
//     // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

const publicRoutes = ['/login', '/signup'];
const protectedRoutes = '/dashboard';
const adminRoutes = '/dashboard/invoices';

async function verifyToken(token: string) {
    return (JSON.parse(atob(token.split('.')[1])))
}

async function signToken(payload: object) {
    // Implement your token signing logic using Web Crypto API
    // This is a placeholder implementation
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(process.env.AUTH_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    )
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('session');
    const isProtectedRoute = pathname.startsWith(protectedRoutes);
    const isAdminRoute = pathname.startsWith(adminRoutes);

    if(isProtectedRoute && !sessionCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAdminRoute && !sessionCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    let res = NextResponse.next();

    if (sessionCookie) {
        try {
            const parsed = await verifyToken(sessionCookie.value);

            if(isAdminRoute && !parsed?.isAdmin) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

            res.cookies.set({
                name: 'session',
                value: await signToken({
                    ...parsed,
                    expires: expiresInOneDay.toISOString(),
                }),
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                expires: expiresInOneDay,
            });
        } catch (error) {
            res.cookies.delete('session');
            if (isProtectedRoute) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
    }

    return res;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};