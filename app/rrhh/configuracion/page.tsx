import { auth } from "@/auth";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import Configuracion from "@/lib/components/configuracion";
import { redirect } from "next/navigation";

export default async function RRHHConfiguracionPage() {
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Configuración'>
            <Configuracion />
        </PageWrapper>
    );
};