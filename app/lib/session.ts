import 'server-only';
import {SignJWT, jwtVerify} from 'jose';
import { SessionPayload } from '@/app/lib/definitions';
import {cookies} from "next/headers";
import {getUser} from "@/app/lib/data";

const secretKey = process.env.AUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
    console.log(secretKey)
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try{
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload;
    } catch (error) {
        console.log("Failed to verify session" + error);
    }
}

export async function createSession(userId: string) {
    const expiresAt: Date = new Date(Date.now() + 7*24*60*60*1000);
    const user = await getUser(userId);
    // const isAdmin = user?.isAdmin || false;
    const isAdmin = false;
    const session = await encrypt({userId, expiresAt, isAdmin})
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    })

}