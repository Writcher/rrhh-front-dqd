import { auth } from "@/auth";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import Informes from "@/lib/components/importaciones";
import { redirect } from "next/navigation";

export default async function AdministrativoInformesPage() {
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Importaciones'>
            <Informes />
        </PageWrapper>
    );
};