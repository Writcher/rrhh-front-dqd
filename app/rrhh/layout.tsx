import { auth } from "@/auth";
import RoleLayoutWrapper from "@/lib/components/common/wrappers/roleLayoutWrapper";
import { forbidden } from "next/navigation";

export default async function RrhhLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (session?.user?.tipoUsuario !== 'Recursos Humanos') {
        forbidden();
    };
    return (
        <RoleLayoutWrapper
            role='Recursos Humanos'
        >
            {children}
        </RoleLayoutWrapper>
    );
};
