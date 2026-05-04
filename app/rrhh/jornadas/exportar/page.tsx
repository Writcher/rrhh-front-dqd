import { auth } from "@/auth";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import Exportar from "@/lib/components/rrhh/exportar";
import { redirect } from "next/navigation";

export default async function ExportarPage() {
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Exportar Resumen'>
            <Exportar />
        </PageWrapper>
    );
};