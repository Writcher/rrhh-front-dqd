import { auth } from "@/auth";
import { getImportacionById } from "@/lib/actions/importacion/importacion.actions";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import Completar from "@/lib/components/completar";
import { redirect } from "next/navigation";

export default async function AdministradorCompletarPage({ 
    params 
}: {
    params: Promise<{ id: number }>
}) {
    const { id: id } = await params;
    const session = await auth();
    if (!session) redirect('/');

    const importacion = await getImportacionById({ id });
    if (!importacion) redirect('/administrador/importaciones');

    return (
        <PageWrapper title='Completar Importación' subtitle={`${importacion.nombre} - ${importacion.proyecto}`}>
            <Completar id_importacion={id}/>
        </PageWrapper>
    );
};