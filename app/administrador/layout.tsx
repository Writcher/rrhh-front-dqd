import { auth } from "@/auth";
import RoleLayoutWrapper from "@/lib/components/common/wrappers/roleLayoutWrapper";
import { forbidden } from "next/navigation";

export default async function AdministradorLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (session?.user?.tipoUsuario !== 'Administrador') {
        forbidden();
    };
    return (
        <RoleLayoutWrapper
            role='Administrador'
        >
            {children}
        </RoleLayoutWrapper>
    );
};
