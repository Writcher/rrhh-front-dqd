import { auth } from "@/auth";
import Asistencia from "@/lib/components/asistencia";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import { redirect } from "next/navigation";

export default async function AdministradorAsistenciaPage() {
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Asistencia'>
            <Asistencia />
        </PageWrapper>
    );
};