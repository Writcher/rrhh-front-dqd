'use client'

import { doLogout } from "@/lib/actions/auth/auth.actions";
import { useDrawer } from "@/lib/contexts/drawer";
import { Button, Divider, Drawer, IconButton } from "@mui/material";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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

const rrhh = [
    { name: 'Inicio', href: '/rrhh', icon: HomeRoundedIcon },
    { name: 'Jornadas', href: '/rrhh/jornadas', icon: SummarizeRoundedIcon },
    { name: 'Ausencias', href: '/rrhh/ausencias', icon: SummarizeRoundedIcon },
    { name: 'Informes', href: '/rrhh/importaciones', icon: UploadFileRoundedIcon },
    { name: 'Empleados', href: '/rrhh/empleados', icon: PeopleAltRoundedIcon },
    { name: 'Configuración', href: '/rrhh/configuracion', icon: SettingsRoundedIcon }
];

const administrador = [
    { name: 'Inicio', href: '/administrador', icon: HomeRoundedIcon },
    { name: 'Jornadas', href: '/administrador/jornadas', icon: SummarizeRoundedIcon },
    { name: 'Ausencias', href: '/administrador/ausencias', icon: SummarizeRoundedIcon },
    { name: 'Informes', href: '/administrador/importaciones', icon: UploadFileRoundedIcon },
    { name: 'Empleados', href: '/administrador/empleados', icon: PeopleAltRoundedIcon },
    { name: 'Configuración', href: '/administrador/configuracion', icon: SettingsRoundedIcon }
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

function NavLinks({ role, hidden, onNavigate }: { hidden: boolean, role: 'Administrativo' | 'Recursos Humanos' | 'Administrador', onNavigate?: () => void }) {
    const pathname = usePathname();
    let base;
    let links;
    switch (role) {
        case 'Administrativo':
            base = '/administrativo';
            links = administrativo
            break;
        case 'Recursos Humanos':
            base = '/rrhh';
            links = rrhh;
            break;
        case 'Administrador':
            base = '/administrador';
            links = administrador;
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
                            onClick={onNavigate}
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

function NavContent({ role, hidden, isMobile, onNavigate, onToggle, onLogout }: {
    role: 'Administrativo' | 'Recursos Humanos' | 'Administrador';
    hidden: boolean;
    isMobile: boolean;
    onNavigate?: () => void;
    onToggle: () => void;
    onLogout: () => void;
}) {
    return (
        <div className='flex flex-col h-full w-full'>
            <div className='flex shrink-0 h-12 my-[2px]'>
                <NavButton
                    hidden={hidden}
                    icon={isMobile ? <CloseRoundedIcon /> : hidden ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
                    label={isMobile ? 'Cerrar' : 'Menú'}
                    onClick={onToggle}
                    color='warning'
                    className='!grow !items-center !justify-start !rounded !text-gray-800 !font-medium hover:!bg-orange-100 hover:!text-orange-600'
                    classNameHidden='!grow !items-center !justify-center !rounded !text-gray-800 !font-medium hover:!bg-orange-100 hover:!text-orange-600'
                />
            </div>
            <Divider sx={{ bgcolor: '#F97316', height: '2px' }} flexItem />
            <div className='flex flex-col items-start justify-start flex-1 min-h-0 my-[2px] overflow-y-auto'>
                <NavLinks hidden={hidden} role={role} onNavigate={onNavigate} />
            </div>
            <Divider sx={{ bgcolor: '#F97316', height: '2px' }} flexItem />
            <div className='flex shrink-0 h-12 my-[2px]'>
                <NavButton
                    hidden={hidden}
                    icon={<LogoutRoundedIcon />}
                    label='Salir'
                    onClick={onLogout}
                    color='error'
                    className='!grow !items-center !justify-start !rounded !text-red-600 !font-medium hover:!bg-red-100 hover:!text-red-600'
                    classNameHidden='!grow !items-center !justify-center !rounded !text-red-600 !font-medium hover:!bg-red-100 hover:!text-red-600'
                />
            </div>
        </div>
    );
};

export default function Nav({ role }: { role: 'Administrativo' | 'Recursos Humanos' | 'Administrador' }) {
    const { hidden, toggleDrawer, mobileOpen, closeMobile } = useDrawer();

    const handleLogout = async () => {
        await doLogout();
        window.location.href = '/';
    };

    return (
        <>
            <Drawer
                anchor='left'
                variant='temporary'
                open={mobileOpen}
                onClose={closeMobile}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: 'block',
                    '@media (min-width: 768px)': { display: 'none' },
                    '& .MuiDrawer-paper': {
                        width: '240px',
                        height: '100vh',
                        borderRight: '2px solid #f97316',
                        bgcolor: '#FFFFFF',
                        borderRadius: '0 5px 5px 0'
                    },
                }}
            >
                <NavContent
                    role={role}
                    hidden={false}
                    isMobile={true}
                    onNavigate={closeMobile}
                    onToggle={closeMobile}
                    onLogout={handleLogout}
                />
            </Drawer>

            <Drawer
                anchor='left'
                open={true}
                variant='persistent'
                sx={{
                    display: 'none',
                    '@media (min-width: 768px)': { display: 'block' },
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: hidden ? '56px' : '196px',
                            height: 'calc(100vh - 8px)',
                            border: '2px solid #f97316',
                            bgcolor: '#FFFFFF',
                            margin: '4px',
                            borderRadius: '5px',
                        },
                    },
                }}
            >
                <NavContent
                    role={role}
                    hidden={hidden}
                    isMobile={false}
                    onToggle={toggleDrawer}
                    onLogout={handleLogout}
                />
            </Drawer>
        </>
    );
};