import { auth } from "@/auth";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import Empleados from "@/lib/components/empleados";
import { redirect } from "next/navigation";

export default async function AdministrativoEmpleadosPage() {
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Empleados'>
            <Empleados isAdministrativo={session?.user?.tipoUsuario === 'Administrativo'}/>
        </PageWrapper>
    );
};