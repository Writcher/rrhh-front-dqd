'use client'

import Nav from "@/lib/components/nav/nav";
import { useDrawer } from "@/lib/contexts/drawer";

export default function RoleLayoutWrapper({ role, children }: { role: 'Administrativo' | 'Recursos Humanos', children: React.ReactNode }) {
    const { hidden } = useDrawer();

    return (
        <div className='flex flex-row h-screen w-screen overflow-hidden'>
            <div
                style={{
                    width: hidden ? '60px' : '200px',
                    minWidth: hidden ? '60px' : '200px'
                }}
            >
                <Nav role={role} />
            </div>
            <div className='flex flex-1 min-w-0 overflow-hidden'>
                <div className='w-full h-full max-w-[2000px] mx-auto px-2 sm:px-3 lg:px-4 pt-2 sm:pt-3 lg:pt-4 pb-1 overflow-hidden'>
                    {children}
                </div>
            </div>
        </div>
    );
};