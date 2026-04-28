'use client'

import { getAsistenciaInicio } from '@/lib/actions/features/asistencia/asistencia.actions';
import { useSnackbar } from '@/lib/contexts/snackbar';
import { usePagination } from '@/lib/hooks/usePagination';
import { TableBody } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import TableWrapper from '@/lib/components/common/wrappers/tableWrapper';
import { useTabs } from '@/lib/hooks/useTabs';
import { getImportacionCountByProyecto } from '@/lib/actions/importacion/importacion.actions';
import { TableTabs } from '@/lib/components/common/tables/tableTabs';
import { TableBase } from '@/lib/components/common/tables/tableBase';
import { TableHeader } from '@/lib/components/common/tables/tableHeader';
import { TableSkeleton } from '@/lib/components/common/tables/tableSkeleton';
import { InicioAsistenciaTableRow } from './components/inicioAsistenciaTableRow';
import { InicioStats } from './components/inicioStats';

export default function AdministrativoInicio({ proyecto }: { proyecto: number }) {
    //hooks
    const { showWarning } = useSnackbar();
    const tab = useTabs({ tab: 'ausentes' });
    const pagination = usePagination({ limit: 25, resetKey: tab.tab });
    //query
    const asistencia = useQuery({
        queryKey: ['getAsistenciaInicio', pagination.page, pagination.limit],
        queryFn: () => getAsistenciaInicio({ page: pagination.page, limit: pagination.limit })
    });
    const importaciones = useQuery({
        queryKey: ['getImportacionCountByProyecto'],
        queryFn: () => getImportacionCountByProyecto()
    });
    //effects
    useEffect(() => {
        if (asistencia.isError) showWarning('Error al cargar asistencia');
        if (importaciones.isError) showWarning('Error al cargar total de importaciones pendientes');
    }, [asistencia.isError, importaciones.isError, showWarning])
    return (
        <div className='flex flex-row gap-2 w-full h-full overflow-hidden'>
            {/** Stats */}
            <div className='flex flex-col flex-1 gap-2 overflow-hidden'>
                <InicioStats asistencia={asistencia} importaciones={importaciones} proyecto={proyecto} />
            </div>
            {/** Tabla */}
            <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                <TableTabs
                    handleTabChange={(newTab: string) => tab.handleTabChange(null, newTab)}
                    activeTab={tab.tab}
                    tabs={[
                        { label: 'Presentes', value: 'presentes' },
                        { label: 'Ausentes', value: 'ausentes' }
                    ]}
                />
                <TableWrapper
                    isLoading={asistencia.isLoading}
                    page={pagination.page}
                    limit={pagination.limit}
                    handlePageChange={pagination.handlePageChange}
                    handleLimitChange={pagination.handleLimitChange}
                    total={tab.tab === 'ausentes' ? asistencia.data?.totalAusentes ?? 0 : asistencia.data?.totalPresentes ?? 0}
                >
                    <TableBase
                        items={tab.tab === 'ausentes' ? asistencia.data?.ausentes ?? [] : asistencia.data?.presentes ?? []}
                        isLoading={asistencia.isLoading}
                        header={
                            <TableHeader
                                titles={[
                                    { title: 'Número', width: '20%', alignment: 'left' },
                                    { title: 'Nombre y Apellido', width: '60%', alignment: 'center' },
                                    { title: 'Tipo de Empleado', width: '20%', alignment: 'right' }
                                ]}
                            />
                        }
                        skeleton={
                            <TableSkeleton
                                rows={10}
                                columns={[
                                    { variant: 'text', alignment: 'left', colWidth: '20%', width: 50 },
                                    { variant: 'text', alignment: 'center', colWidth: '60%', width: 250 },
                                    { variant: 'text', alignment: 'right', colWidth: '20%', width: 100 }
                                ]}
                            />
                        }
                        body={
                            <TableBody>
                                {(tab.tab === 'ausentes' ? asistencia.data?.ausentes ?? [] : asistencia.data?.presentes ?? [])
                                    .map((empleado, index) => (
                                        <InicioAsistenciaTableRow empleado={empleado} index={index} key={index} />
                                    ))
                                }
                            </TableBody>
                        }
                        noItemMessage={tab.tab === 'ausentes' ? 'No se encontraron ausentes' : 'No se encontraron presentes'}
                        containerClassName='outer-table-container flex-1 overflow-auto'
                    />
                </TableWrapper>
            </div>
        </div>
    );
};