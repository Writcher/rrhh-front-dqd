'use client'

import { useTabs } from "@/lib/hooks/useTabs";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { TableTabs } from "../common/tables/tableTabs";
import ConfiguraciónUsuariosTab from "./components/configuracionUsuariosTab";
import ConfiguraciónTiposAusenciaTab from "./components/configuracionTiposAusenciaTab";
import ConfiguraciónProyectosTab from "./components/configuracionProyectosTab";
import ConfiguraciónControlesTab from "./components/configuracionControlesTab";

export default function Configuracion() {
    const { tipoUsuario } = useUserRole();
    const tab = useTabs({ tab: 'usuarios' });

    const tabs = tipoUsuario === 'Administrador'
        ? [
            { label: 'Usuarios', value: 'usuarios' },
            { label: 'Tipos de Ausencia', value: 'tiposAusencia' },
            { label: 'Proyectos', value: 'proyectos' },
            { label: 'Controles', value: 'controles' },
        ]
        : [
            { label: 'Usuarios', value: 'usuarios' },
            { label: 'Tipos de Ausencia', value: 'tiposAusencia' },
        ];

    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            <TableTabs
                handleTabChange={(newTab: string) => tab.handleTabChange(null, newTab)}
                activeTab={tab.tab}
                tabs={tabs}
            />
            {tab.tab === 'usuarios' && <ConfiguraciónUsuariosTab />}
            {tab.tab === 'tiposAusencia' && <ConfiguraciónTiposAusenciaTab />}
            {tab.tab === 'proyectos' && <ConfiguraciónProyectosTab />}
            {tab.tab === 'controles' && <ConfiguraciónControlesTab />}
        </div>
    );
};
