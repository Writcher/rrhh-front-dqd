import { useSession } from 'next-auth/react';

export const useUserRole = () => {
    const { data: session } = useSession();
    const tipoUsuario = session?.user?.tipoUsuario;
    return {
        tipoUsuario,
        isAdministrativo: tipoUsuario === 'Administrativo'
    };
};
