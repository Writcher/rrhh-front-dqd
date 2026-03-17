'use client';

import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <p>Nombre: {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
      <p>Rol: {session?.user?.tipoUsuario}</p>
    </div>
  );
}