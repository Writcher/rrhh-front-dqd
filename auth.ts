import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUsuarioByEmail } from './actions/usuario/usuario.actions';
import { getTipoUsuarioById } from './actions/tipoUsuario/tipoUsuario.actions';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                };

                try {
                    const usuario = await getUsuarioByEmail({
                        email: credentials.email as string,
                    });

                    if (!usuario) {
                        return null;
                    };

                    const isValidPassword = await bcrypt.compare(
                        credentials.password as string,
                        usuario.contraseña
                    );

                    if (!isValidPassword) {
                        return null;
                    };

                    const tipoUsuario = await getTipoUsuarioById({
                        id: usuario.id_tipousuario,
                    });

                    if (!tipoUsuario) {
                        return null;
                    };

                    return {
                        id: usuario.id.toString(),
                        name: usuario.nombre,
                        email: usuario.email,
                        tipoUsuario: tipoUsuario.nombre as 'Administrativo' | 'Recursos Humanos' | 'Administrador',
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.tipoUsuario = user.tipoUsuario;
            };
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.tipoUsuario = token.tipoUsuario as 'Administrativo' | 'Recursos Humanos' | 'Administrador';
            };
            return session;
        },
    },

    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
});