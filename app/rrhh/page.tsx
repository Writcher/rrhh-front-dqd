import { auth } from "@/auth";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import RRHHInicio from "@/lib/components/rrhh/inicio";
import { redirect } from "next/navigation";

export default async function RRHHInicioPage() {
    const session = await auth();
    if (!session) redirect('/');

    return(
        <PageWrapper title={`Hola, ${session?.user.name}`} subtitle='Resumen actual de cada proyecto:'>
            <RRHHInicio/>
        </PageWrapper>
    );
};