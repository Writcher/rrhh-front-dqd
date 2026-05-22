'use server'

import { auth } from '@/auth';
import jwt from 'jsonwebtoken';

export async function getToken() {
    const session = await auth();

    if (!session || !session.user) {
        throw new Error('Usuario no autenticado');
    };

    const token = jwt.sign(
        {
            id: session.user.id,
            correo: session.user.email,
            tipoUsuario: session.user.tipoUsuario,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        },
        process.env.JWT_SECRET!
    );

    return token;
};