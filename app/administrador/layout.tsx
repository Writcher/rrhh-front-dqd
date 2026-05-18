'use client'

import RoleLayoutWrapper from "@/lib/components/common/wrappers/roleLayoutWrapper";

export default function AdministradorLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleLayoutWrapper
            role='Administrador'
        >
            {children}
        </RoleLayoutWrapper>
    );
};