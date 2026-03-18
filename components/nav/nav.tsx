'use client'

import { doLogout } from "@/actions/auth/auth.actions";
import { useDrawer } from "@/lib/contexts/drawer";
import { Button, Divider, Drawer, IconButton } from "@mui/material";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Link from "next/link";

const administrativo = [
    { name: 'Inicio', href: '/administrativo', icon: HomeRoundedIcon },
    { name: 'Jornadas', href: '/administrativo/jornadas', icon: SummarizeRoundedIcon },
    { name: 'Ausencias', href: '/administrativo/ausencias', icon: SummarizeRoundedIcon },
    { name: 'Informes', href: '/administrativo/importaciones', icon: UploadFileRoundedIcon },
    { name: 'Empleados', href: '/administrativo/empleados', icon: PeopleAltRoundedIcon },
];

const administrador = [
    { name: 'Inicio', href: '/administrador', icon: HomeRoundedIcon },
    { name: 'Usuarios', href: '/administrador/usuarios', icon: PeopleAltRoundedIcon },
    { name: 'Parametros', href: '/administrador/parametros', icon: SettingsRoundedIcon },
];

const rrhh = [
    { name: 'Inicio', href: '/rrhh', icon: HomeRoundedIcon },
    { name: 'Jornadas', href: '/rrhh/jornadas', icon: SummarizeRoundedIcon },
    { name: 'Ausencias', href: '/rrhh/ausencias', icon: SummarizeRoundedIcon },
    { name: 'Informes', href: '/rrhh/importaciones', icon: UploadFileRoundedIcon },
    { name: 'Empleados', href: '/rrhh/empleados', icon: PeopleAltRoundedIcon },
];


function NavButton({ hidden, icon, label, onClick, href, color, className, classNameHidden }: {
    hidden: boolean;
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
    color: 'warning' | 'error';
    className: string;
    classNameHidden: string;
}) {
    if (hidden) {
        return (
            <IconButton
                color={color}
                onClick={onClick}
                sx={{ marginY: '2px', marginX: '4px' }}
                className={hidden ? classNameHidden : className}
                {...(href && { component: Link, href })}
            >
                {icon}
            </IconButton>
        );
    }
    return (
        <Button
            variant='text'
            color={color}
            fullWidth
            disableElevation
            onClick={onClick}
            startIcon={icon}
            className={hidden ? classNameHidden : className}
            sx={{ textTransform: 'none', marginY: '2px', marginX: '4px', paddingLeft: '14px', '& .MuiButton-iconSizeMedium > *:nth-of-type(1)': { fontSize: '1.5rem' } }}
            {...(href && { component: Link, href })}
        >
            <span className='text-sm'>{label}</span>
        </Button>
    );
};

function NavLinks({ role, hidden }: { hidden: boolean, role: 'Administrativo' | 'Recursos Humanos' | 'Administrador' }) {
    const pathname = usePathname();
    let base;
    let links;
    switch (role) {
        case 'Administrador':
            base = '/administrador';
            links = administrador;
            break;
        case 'Administrativo':
            base = '/administrativo';
            links = administrativo
            break;
        case 'Recursos Humanos':
            base = '/rrhh';
            links = rrhh;
            break;
    };
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                const isActive =
                    link.href === base
                        ? pathname === link.href
                        : pathname.startsWith(link.href);

                return (
                    <div className='flex shrink-0 w-full h-12' key={link.href}>
                        <NavButton
                            hidden={hidden}
                            icon={<LinkIcon />}
                            label={link.name}
                            href={link.href}
                            color='warning'
                            className={`!grow !items-center !justify-start !rounded !font-medium hover:!bg-orange-100 hover:!text-orange-600 ${isActive ? '!text-orange-600 !bg-orange-100' : '!text-gray-800'}`}
                            classNameHidden={`!grow !items-center !justify-center !rounded !font-medium hover:!bg-orange-100 hover:!text-orange-600 ${isActive ? '!text-orange-600 !bg-orange-100' : '!text-gray-800'}`}
                        />
                    </div>
                )
            })}
        </>
    );
};

export default function Nav({ role }: { role: 'Administrativo' | 'Recursos Humanos' | 'Administrador' }) {
    const { hidden, toggleDrawer } = useDrawer();

    return (
        <Drawer
            anchor='left'
            open={true}
            variant='persistent'
            slotProps={{
                paper: {
                    sx: {
                        width: hidden ? '56px' : '196px',
                        height: 'calc(100vh - 8px)',
                        border: '2px solid #f97316',
                        bgcolor: '#FFFFFF',
                        margin: '4px',
                        borderRadius: '5px'
                    },
                },
            }}
        >
            <div className='flex flex-col h-full w-full'>
                <div className='flex shrink-0 h-12 my-[2px]'>
                    <NavButton
                        hidden={hidden}
                        icon={hidden ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
                        label='Menú'
                        onClick={toggleDrawer}
                        color='warning'
                        className='!grow !items-center !justify-start !rounded !text-gray-800 !font-medium hover:!bg-orange-100 hover:!text-orange-600'
                        classNameHidden='!grow !items-center !justify-center !rounded !text-gray-800 !font-medium hover:!bg-orange-100 hover:!text-orange-600'
                    />
                </div>
                <Divider sx={{ bgcolor: '#F97316', height: '2px' }} flexItem />
                <div className='flex flex-col items-start justify-start flex-1 min-h-0 my-[2px] overflow-y-auto'>
                    <NavLinks hidden={hidden} role={role} />
                </div>
                <Divider sx={{ bgcolor: '#F97316', height: '2px' }} flexItem />
                <div className='flex shrink-0 h-12 my-[2px]'>
                    <NavButton
                        hidden={hidden}
                        icon={<LogoutRoundedIcon />}
                        label='Salir'
                        onClick={doLogout}
                        color='error'
                        className='!grow !items-center !justify-start !rounded !text-red-600 !font-medium hover:!bg-red-100 hover:!text-red-600'
                        classNameHidden='!grow !items-center !justify-center !rounded !text-red-600 !font-medium hover:!bg-red-100 hover:!text-red-600'
                    />
                </div>
            </div>
        </Drawer>
    );
};