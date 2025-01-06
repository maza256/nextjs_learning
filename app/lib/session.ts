import 'server-only';
import {SignJWT, jwtVerify} from 'jose';
import {SessionPayload, User} from '@/app/lib/definitions';
import {cookies} from "next/headers";
import {getUser, getUserById} from "@/app/lib/data";
import { compare, hash } from 'bcryptjs';

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
    console.log("userId: " + userId);
    const user = await getUserById(userId);
    console.log(`User fetched: ${JSON.stringify(user)}`);
    if (!user) {
        throw new Error("User not found");
    }
    const isAdmin = user!.isAdmin
    return await encrypt({userId, expiresAt, isAdmin})
}

const key = new TextEncoder().encode(process.env.AUTH_SECRET);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
    return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
    plainTextPassword: string,
    hashedPassword: string
) {
    return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
    user: { id: string };
    expires: string;
    isAdmin: boolean;
};

export async function signToken(payload: SessionData) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1 day from now')
        .sign(key);
}

export async function verifyToken(input: string) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload as SessionData;
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    return await verifyToken(session);
}

export async function setSession(user: User) {
    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const session: SessionData = {
        user: { id: user.id! },
        expires: expiresInOneDay.toISOString(),
        isAdmin: user.isAdmin,
    };
    const encryptedSession = await signToken(session);
    (await cookies()).set('session', encryptedSession, {
        expires: expiresInOneDay,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
    });
}