'use server';
import { z } from 'zod';
import Database from "../lib/db"
import { revalidatePath } from "next/cache";
import {redirect} from "next/navigation";
import {signIn} from "@/auth";
import {AuthError, NextAuthConfig, NextAuthResult, Session} from "next-auth";
import {createSession} from "@/app/lib/session";
import  getServerSession  from "next-auth";
import { authConfig} from "@/auth.config";
import { cookies } from 'next/headers';
import {getUser} from "@/app/lib/data";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer.",
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: "Please enter a valid amount above 0." }),
    status: z.enum(['pending', 'paid'], { invalid_type_error: "Please enter a valid status." }),
    date: z.string(),
    // amount: z
    //     .coerce
    //     .string()
    //     .gt(0, { message: "Please enter an amount greater than 0." })
    //     .transform((value: string): number => {
    //         const sanitized = value.replace(/[£,$]/g, "").trim();
    //         const parsed = parseFloat(sanitized);
    //         if (isNaN(parsed)) throw new Error("Invalid amount");
    //         return Math.round(parsed * 100); // Convert to integer cents
    //     }),
});

// const FormSchema = z.object({
//     id: z.string(),
//     customerId: z.string(),
//     amount:  z.coerce.string().transform((value: string):number => {
//         const sanitized = value.replace(/[£,$]/g, "").trim();
//         return parseFloat(sanitized);
//     }),
//     status: z.enum(['pending', 'paid']),
//     date: z.string(),
// });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

const CreateInvoice = FormSchema.omit({id: true, date: true})

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Invoice."
        }
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        const pool = Database.getInstance()
        await pool.query(`
                    INSERT INTO invoices (customer_id, amount, status, date)
                    VALUES ($1, $2, $3, $4)`,
            [customerId, amountInCents, status, date]);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to create invoice");
    }

    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })
    // const amountInCents = amount * 100;
    try {
        const pool = Database.getInstance()

        await pool.query(`
            UPDATE invoices
            SET customer_id = $1,
                amount=$2,
                status=$3
            WHERE id = $4`, [customerId, amount, status, id]);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to update invoice");
    }
    revalidatePath("/dashboard/invoices");
    redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
    const pool = Database.getInstance()

    try {
        await pool.query(`DELETE
                          FROM invoices
                          WHERE id = $1`, [id]);
        // return { message: 'Deleted Invoice: ' + id };
    } catch (error) {
        console.log(error);
        throw new Error(`Database Error: ${error}`);
    }
    revalidatePath("/dashboard/invoices");
}
interface ExtendedSession extends Session {
    expires: string;

}
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const response = await signIn('credentials', {
            redirect: false,
            email: formData.get('email'),
            password: formData.get('password'),
        });

        if (response?.error) {
            return "Invalid credentials";
        }

        const user = await getUser(<string>formData.get('email'));
        const userid = user?.id;
        if (userid == null) {
            throw new Error("Could not find user")
        }

        console.log("We got a user!")

        const session = await createSession(userid);

        // Set the session cookie
        const cookieStore = await cookies();
        const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
        cookieStore.set('session', JSON.stringify(session), {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: expiresInOneDay,
        });
        revalidatePath("/dashboard");
        redirect("/dashboard");
        return "Login Succesful"
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return "Invalid credentials"
                default:
                    return "Something went wrong"
            }
        }
        throw error;
    }
}