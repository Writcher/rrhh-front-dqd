import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      tipoUsuario: 'Administrativo' | 'Recursos Humanos' | 'Administrador';
    } & DefaultSession['user'];
  };

  interface User {
    id: string;
    name: string;
    email: string;
    tipoUsuario: 'Administrativo' | 'Recursos Humanos' | 'Administrador';
  };
};

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    tipoUsuario: 'Administrativo' | 'Recursos Humanos' | 'Administrador';
  };
};