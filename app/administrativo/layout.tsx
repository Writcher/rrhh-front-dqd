'use client'

import RoleLayoutWrapper from "@/components/common/wrappers/roleLayoutWrapper";

export default function AdministrativoLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleLayoutWrapper
            role='Administrativo'
        >
            {children}
        </RoleLayoutWrapper>
    );
};