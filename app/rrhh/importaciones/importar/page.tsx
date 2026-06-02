import { auth } from "@/auth";
import Importar from "@/lib/components/administrativo/importar";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import { redirect } from "next/navigation";

export default async function AdministradorImportarPage() {
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Importar'>
            <Importar/>
        </PageWrapper>
    );
};