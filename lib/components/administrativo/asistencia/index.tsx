'use client'

import { TableBase } from "@/lib/components/common/tables/tableBase";
import { TableHeader } from "@/lib/components/common/tables/tableHeader";
import { TableSkeleton } from "@/lib/components/common/tables/tableSkeleton";
import { TableTabs } from "@/lib/components/common/tables/tableTabs";
import TableWrapper from "@/lib/components/common/wrappers/tableWrapper";
import { Button, TableBody } from "@mui/material";
import { InicioAsistenciaTableRow } from "../inicio/components/inicioAsistenciaTableRow";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { usePagination } from "@/lib/hooks/usePagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAsistencia } from "@/lib/actions/features/asistencia/asistencia.actions";
import { useEffect, useMemo } from "react";
import { useTabs } from "@/lib/hooks/useTabs";
import Link from "next/link";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useFilters } from "@/lib/hooks/useFilters";
import { useForm } from "react-hook-form";
import { AsistenciaTableFiltersFormData } from "./types/asistenciaTableFiltersFormData";
import { FilterBar } from "@/lib/components/common/filters/filterBar";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { exportAsistencia } from "@/lib/actions/features/export/export.actions";
import { getNombreById } from "@/lib/utils/getNombreById";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SyncIcon from '@mui/icons-material/Sync';
import { StatsCard } from "../../common/components/statsCard";

const categories = [
    { category: 'Presentes', key: 'totalPresentes' },
    { category: 'Jornaleros Presentes', key: 'totalJornaleros' },
    { category: 'Mensuales Presentes', key: 'totalMensuales' },
    { category: 'Ausentes', key: 'totalAusentes' },
] as const;

export default function Asistencia() {
    //hooks
    const { showSuccess, showError, showWarning } = useSnackbar();
    const { setValue, watch, handleSubmit } = useForm<AsistenciaTableFiltersFormData>({
        defaultValues: {
            id_proyecto: '',
            fecha: ''
        }
    });
    const tab = useTabs({ tab: 'ausentes' });
    const filters = useFilters([
        { key: 'id_proyecto', type: 'select' },
        { key: 'fecha', type: 'datepicker' }
    ], { setValue, watch }, { syncUrl: true });
    const pagination = usePagination({
        limit: 25,
        resetKey: `${tab.tab}-${watch('id_proyecto')}-${watch('fecha')}`
    });
    //query
    const proyectos = useQuery({
        queryKey: ['getProyectos'],
        queryFn: () => getProyectos(),
        refetchOnWindowFocus: false
    });
    const asistencia = useQuery({
        queryKey: [
            'getAsistencia',
            pagination.page,
            pagination.limit,
            watch('id_proyecto'),
            watch('fecha')
        ],
        queryFn: () => getAsistencia({
            page: pagination.page,
            limit: pagination.limit,
            id_proyecto: watch('id_proyecto'),
            fecha: watch('fecha')
        }),
        enabled: !!watch('id_proyecto') && !!watch('fecha')
    });
    //memo
    const getNombreProyecto = useMemo(() => getNombreById(proyectos.data ?? []), [proyectos.data]);
    const empleadosTab = useMemo(
        () => tab.tab === 'ausentes' ? asistencia.data?.ausentes ?? [] : asistencia.data?.presentes ?? [],
        [tab.tab, asistencia.data]
    );
    //mutation
    const download = useMutation({
        mutationFn: (data: AsistenciaTableFiltersFormData) => exportAsistencia(data),
        onSuccess: (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Listado de Asistencia - ${getNombreProyecto(Number(watch('id_proyecto')))} - ${watch('fecha')}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            showSuccess('Asistencia exportada correctamente');
        },
        onError: () => showError('Error al exportar asistencia')
    });
    //effects
    useEffect(() => {
        if (asistencia.isError) showWarning('Error al cargar asistencia');
    }, [asistencia.isError, showWarning])
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            {/** Filtros */}
            <FilterBar
                filtersHook={filters}
                items={[
                    { key: 'id_proyecto', menuLabel: 'Filtrar por Proyecto', inputLabel: 'Proyecto', inputType: 'select', options: proyectos.data, value: watch('id_proyecto'), loading: proyectos.isLoading },
                    { key: 'fecha', menuLabel: 'Filtrar por Fecha', inputLabel: 'Fecha', inputType: 'datepicker', value: watch('fecha') }
                ]}
                actions={
                    <>
                        <Button
                            variant='contained'
                            color='success'
                            disableElevation
                            onClick={handleSubmit((data) => download.mutate(data))}
                            endIcon={
                                download.isPending ? (
                                    <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                                ) : <DownloadRoundedIcon />
                            }
                            disabled={download.isPending || !watch('id_proyecto') || !watch('fecha')}
                        >
                            {!download.isPending ? 'Descargar' : 'Descargando'}
                        </Button>
                    </>
                }
                showClean={false}
                showMenu={false}
            />
            {/** Stats */}
            <div className='grid grid-cols-4 grid-rows-1 gap-2'>
                {categories.map(({ category, key }) => (
                    <StatsCard key={key} category={category} total={asistencia.data?.[key]} isLoading={asistencia.isLoading} />
                ))}
            </div>
            {/** Tabs */}
            <TableTabs
                handleTabChange={(newTab: string) => tab.handleTabChange(null, newTab)}
                activeTab={tab.tab}
                tabs={[
                    { label: 'Presentes', value: 'presentes' },
                    { label: 'Ausentes', value: 'ausentes' }
                ]}
            />
            {/** Tabla */}
            <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                <TableWrapper
                    isLoading={asistencia.isLoading}
                    page={pagination.page}
                    limit={pagination.limit}
                    handlePageChange={pagination.handlePageChange}
                    handleLimitChange={pagination.handleLimitChange}
                    total={tab.tab === 'ausentes' ? asistencia.data?.totalAusentes ?? 0 : asistencia.data?.totalPresentes ?? 0}
                >
                    <TableBase
                        items={empleadosTab}
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
                                {empleadosTab.map((empleado, index) => (
                                    <InicioAsistenciaTableRow empleado={empleado} index={index} key={index} />
                                ))}
                            </TableBody>
                        }
                        noItemMessage={tab.tab === 'ausentes' ? 'No se encontraron ausentes' : 'No se encontraron presentes'}
                        containerClassName='outer-table-container flex-1 overflow-auto'
                    />
                </TableWrapper>
            </div>
            {/** Botones */}
            <div className='flex w-full'>
                <Button
                    component={Link}
                    variant='contained'
                    color='warning'
                    href={'/administrativo/empleados'}
                    disableElevation
                    startIcon={<ArrowBackRoundedIcon />}
                >
                    Empleados
                </Button>
            </div>
        </div >
    );
};