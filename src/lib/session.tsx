"use server";
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

export type UserInfo = { uid: string, role: 'admin' | 'user', name: string | null }

// Sign full user object into JWT
function sign(payload: object): Promise<string> {
    return new SignJWT(payload as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

// Verify JWT and return payload
async function verify<T>(token: string): Promise<T> {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as T;
}

// Store full user session in a cookie
export async function setSession(value: UserInfo): Promise<string> {
    const token = await sign(value as any);

    (await cookies()).set('session', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return token;
}

// Read full user session from cookie
export async function getSession<T>(): Promise<UserInfo | null> {
    const token = (await cookies()).get('session')?.value;
    if (!token) return null;

    try {
        return await verify<UserInfo>(token);
    } catch {
        return null;
    }
}
