import { auth } from "@/auth";
import Ausencias from "@/lib/components/ausencias";
import PageWrapper from "@/lib/components/common/wrappers/pageWrapper";
import { redirect } from "next/navigation";

export default async function RRHHAusenciasPage() {
    const session = await auth();
    if (!session) redirect('/');

    return (
        <PageWrapper title='Ausencias'>
            <Ausencias />
        </PageWrapper>
    );
};