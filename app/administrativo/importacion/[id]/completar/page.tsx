import { auth } from "@/auth";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import Completar from "@/lib/components/completar";
import { redirect } from "next/navigation";

export default async function AdministrativoCompletarPage({ 
    params 
}: {
    params: Promise<{ id: number }>
}) {
    const { id: id } = await params;
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Completar Importación'>
            <Completar id_importacion={id}/>
        </PageWrapper>
    );
};