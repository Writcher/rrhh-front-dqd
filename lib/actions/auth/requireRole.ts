import { auth } from '@/auth';
import type { Session } from 'next-auth';

export type Rol = 'Administrativo' | 'Recursos Humanos' | 'Administrador';

export async function requireRole(allowed: Rol[]): Promise<Session> {
    const session = await auth();

    if (!session) {
        throw new Error('No autenticado');
    };

    if (!allowed.includes(session.user.tipoUsuario)) {
        console.warn('Role check failed: ', {
            email: session.user.email,
            tipoUsuario: session.user.tipoUsuario,
            allowed,
            timestamp: new Date().toISOString()
        });
        throw new Error('No autorizado');
    };

    return session;
};
