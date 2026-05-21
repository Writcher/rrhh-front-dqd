'use client'

import Nav from "@/lib/components/nav/nav";
import { useDrawer } from "@/lib/contexts/drawer";
import { IconButton } from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

export default function RoleLayoutWrapper({ role, children }: { role: 'Administrativo' | 'Recursos Humanos' | 'Administrador', children: React.ReactNode }) {
    const { hidden, openMobile } = useDrawer();

    return (
        <div className='flex flex-col md:flex-row h-screen w-screen overflow-hidden'>
            <div className='md:hidden flex shrink-0 h-14 items-center border-b-2 border-orange-500 bg-white px-2 gap-2'>
                <IconButton color='warning' onClick={openMobile} aria-label='Abrir menú'>
                    <MenuRoundedIcon />
                </IconButton>
                <span className='font-semibold text-gray-800'>Registro Horario</span>
            </div>

            <Nav role={role} />

            <div
                className='hidden md:block shrink-0'
                style={{
                    width: hidden ? '60px' : '200px',
                    minWidth: hidden ? '60px' : '200px'
                }}
                aria-hidden='true'
            />

            <div className='flex flex-1 min-w-0 min-h-0 overflow-hidden'>
                <div className='w-full h-full max-w-[2000px] mx-auto px-2 sm:px-3 lg:px-4 pt-2 sm:pt-3 lg:pt-4 pb-1 overflow-hidden'>
                    {children}
                </div>
            </div>
        </div>
    );
};