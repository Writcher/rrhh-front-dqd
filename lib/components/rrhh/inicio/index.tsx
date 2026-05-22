'use client'

import { getImportacionCountForProyectos } from "@/lib/actions/importacion/importacion.actions";
import { getAusenciasPendientesCountForProyectos } from "@/lib/actions/jornada/jornada.actions";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { getNombreById } from "@/lib/utils/getNombreById";
import { getQuincenaVigente } from "@/lib/utils/getQuincenaVigente";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton } from "@mui/material";
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import Link from "next/link";
import { useEffect, useMemo } from "react";

export default function RRHHInicio() {
    //hooks
    const { showWarning } = useSnackbar();
    //query
    const proyectos = useQuery({
        queryKey: ['getProyectos'],
        queryFn: () => getProyectos(),
        refetchOnWindowFocus: false
    });
    const importaciones = useQuery({
        queryKey: ['getImportacionCountForProyectos'],
        queryFn: () => getImportacionCountForProyectos()
    });
    const ausenciasPendientes = useQuery({
        queryKey: ['getAusenciasPendientesCountForProyecto'],
        queryFn: () => getAusenciasPendientesCountForProyectos()
    });
    //memo
    const getNombreProyecto = useMemo(() => getNombreById(proyectos.data ?? []), [proyectos.data]);
    const visibleProyectoIds = useMemo(() => {
        const ids = new Set<number>();
        for (const id of Object.keys(importaciones.data ?? {})) ids.add(Number(id));
        for (const id of Object.keys(ausenciasPendientes.data ?? {})) ids.add(Number(id));
        return Array.from(ids);
    }, [importaciones.data, ausenciasPendientes.data]);
    //effects
    useEffect(() => {
        if (importaciones.isError) showWarning('Error al cargar total de importaciones pendientes');
        if (ausenciasPendientes.isError) showWarning('Error al cargar total de ausencias pendientes');
        if (proyectos.isError) showWarning('Error al cargar proyectos');
    }, [proyectos.isError, importaciones.isError, ausenciasPendientes.isError, showWarning])

    const isLoading = proyectos.isLoading || importaciones.isLoading || ausenciasPendientes.isLoading;
    const quincena = getQuincenaVigente();

    return (
        <div className='flex flex-col gap-3 w-full h-full overflow-auto'>
            <div className='flex flex-row items-center justify-between gap-4 flex-wrap'>
                <div className='flex flex-col'>
                    <span className='text-sm text-gray-500'>Quincena vigente: </span>
                    <span className='text-2xl font-semibold text-gray-700'>{quincena.label}</span>
                </div>
                <Button
                    component={Link}
                    href='/rrhh/jornadas/exportar'
                    variant='contained'
                    className='!bg-gray-800 !text-white !border-gray-800 hover:!bg-orange-100 hover:!text-orange-600 !border-2 hover:!border-orange-500' disableElevation
                    endIcon={<SummarizeRoundedIcon className='!text-2xl' />}
                >
                    Exportar Resumen
                </Button>
            </div>
            {isLoading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} variant='rectangular' className='!rounded !h-28 !w-full' />
                    ))}
                </div>
            ) : visibleProyectoIds.length === 0 ? (
                <div className='flex flex-col items-center justify-center gap-2 py-12 text-gray-500'>
                    <CheckCircleOutlineRoundedIcon className='!text-5xl text-orange-500' />
                    <span className='text-sm'>No hay pendientes en esta quincena</span>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
                    {visibleProyectoIds.map((id) => {
                        const totalImportaciones = importaciones.data?.[id] ?? 0;
                        const totalAusencias = ausenciasPendientes.data?.[id] ?? 0;
                        const sinPendientes = totalImportaciones === 0 && totalAusencias === 0;
                        return (
                            <div
                                key={id}
                                className='flex flex-col border border-orange-500 border-2 rounded text-gray-700 overflow-hidden'
                            >
                                <div className='bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 text-sm truncate border-b border-gray-300'>
                                    {getNombreProyecto(id)}
                                </div>
                                {sinPendientes ? (
                                    <div className='flex flex-col items-center justify-center gap-1 py-5 px-3 text-gray-500'>
                                        <CheckCircleOutlineRoundedIcon className='!text-3xl text-orange-500' />
                                        <span className='text-xs'>Sin pendientes</span>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-2 divide-x divide-gray-300'>
                                        <Link
                                            href={`/rrhh/importaciones?id_proyecto=${id}&incompletas=true`}
                                            className='flex flex-col items-center justify-center py-3 px-2 hover:bg-orange-100 transition-colors'
                                        >
                                            <span className='text-2xl font-bold'>{totalImportaciones}</span>
                                            <span className='text-xs text-gray-500 text-center leading-tight mt-0.5'>Importaciones pendientes</span>
                                        </Link>
                                        <Link
                                            href={`/rrhh/ausencias?id_proyecto=${id}&id_tipoausencia=3`}
                                            className='flex flex-col items-center justify-center py-3 px-2 hover:bg-orange-100 transition-colors'
                                        >
                                            <span className='text-2xl font-bold'>{totalAusencias}</span>
                                            <span className='text-xs text-gray-500 text-center leading-tight mt-0.5'>Ausencias pendientes</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
