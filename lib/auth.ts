import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);


export interface UserPayload {
    id: string;
    name: string;
    vendorType: string;
}

export async function signToken(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secretKey);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
    try {
        const { payload } = await jwtVerify<UserPayload>(token, secretKey);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function authenticateUser(email: string, password: string) {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user[0]) return null;

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) return null;

    return user[0];
}