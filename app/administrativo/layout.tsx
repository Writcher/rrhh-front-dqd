import { auth } from "@/auth";
import RoleLayoutWrapper from "@/lib/components/common/wrappers/roleLayoutWrapper";
import { forbidden } from "next/navigation";

export default async function AdministrativoLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (session?.user?.tipoUsuario !== 'Administrativo') {
        forbidden();
    };
    return (
        <RoleLayoutWrapper
            role='Administrativo'
        >
            {children}
        </RoleLayoutWrapper>
    );
};
