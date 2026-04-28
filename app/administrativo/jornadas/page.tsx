import { auth } from "@/auth";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import Jornadas from "@/lib/components/jornadas";
import { redirect } from "next/navigation";

export default async function AdministrativoJornadasPage() {
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Jornadas'>
            <Jornadas isAdministrativo={session?.user?.tipoUsuario === 'Administrativo'}/>
        </PageWrapper>
    );
};