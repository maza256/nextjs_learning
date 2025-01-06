import NextAuth from 'next-auth';
import {authConfig} from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import Database from "@/app/lib/db";
import bcrypt from "bcrypt";
import { getUser } from "@/app/lib/data";
import {cookies} from "next/headers";

export const { auth, signIn } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({email: z.string().email(), password: z.string().min(6)})
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const {email, password} = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if(passwordsMatch) return user;

                }
                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
});

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

// export const {auth, signIn, signOut} = NextAuth({
//     ...authConfig,
//     providers: [
//         Credentials({ credentials: {
//             email: {},
//             password: {},
//             },
//             async authorize(credentials, req) {
//
//                 console.log(credentials?.email);
//                 console.log(credentials?.password);
//
//                 const parsedCredentials = z
//                     .object({ email: z.string().email(), password: z.string().min(6) })
//                     .safeParse(credentials);
//                 console.log("Parsed credentials: " + JSON.stringify(parsedCredentials));
//                 if (parsedCredentials.success) {
//                     const { email, password } = parsedCredentials.data;
//                     const user = await getUser(email);
//                     if (!user) return null;
//                     const passwordsMatch = await bcrypt.compare(password, user.password);
//                     console.log("Passwords match? " + passwordsMatch);
//                     if (passwordsMatch) return user;
//                 }
//                 console.log("Invalid credentials");
//                 return null;
//             }
//         }),
//     ]
// });