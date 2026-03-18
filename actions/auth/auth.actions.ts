'use server'

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { rateLimit, getRemainingTime } from '@/lib/rate-limit';

export type LoginResult =
    | { success: true }
    | { success: false; error: string };

export async function logIn({
    email,
    password
}: {
    email: string
    password: string
}): Promise<LoginResult> {
    // Rate limiting - 5 attempts per minute per email
    if (!rateLimit(email, 5, 60000)) {
        const remainingSeconds = getRemainingTime(email);
        return {
            success: false,
            error: `Demasiados intentos. Intente nuevamente en ${remainingSeconds} segundos.`,
        };
    };

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                success: false,
                error: 'Credenciales inválidas',
            };
        };

        console.error('Login error:', error);
        return {
            success: false,
            error: 'Ocurrió un error. Intente nuevamente.',
        };
    };
};

export async function doLogout() {
    await signOut({ redirectTo: '/' });
};