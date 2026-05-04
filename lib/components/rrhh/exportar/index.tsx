'use client'

import { useSnackbar } from "@/lib/contexts/snackbar";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ExportFormData } from "./types/exportFromData";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { getMeses } from "@/lib/actions/mes/mes.actions";
import { getTiposEmpleado } from "@/lib/actions/tipoEmpleado/tipoEmpleado.actions";
import { getNombreById } from "@/lib/utils/getNombreById";
import { getNombresMeses } from "@/lib/utils/getNombresMeses";
import { useEffect } from "react";
import { exportResumen } from "@/lib/actions/features/export/export.actions";
import { Button } from "@mui/material";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import Link from "next/link";
import SyncIcon from '@mui/icons-material/Sync';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ExportarFormInputs from "./components/exportarFormInputs";

export default function Exportar() {
    //init
    const router = useRouter();
    //hooks
    const { showSuccess, showError, showWarning } = useSnackbar();
    const { control, handleSubmit, formState: { isValid }, watch } = useForm<ExportFormData>({
        defaultValues: {
            proyectos: [],
            id_tipoempleado: '',
            id_mes: '',
            quincena: ''
        }
    });
    //query
    const proyectos = useQuery({
        queryKey: ['getProyectos'],
        queryFn: () => getProyectos(),
        refetchOnWindowFocus: false
    });
    const tiposEmpleado = useQuery({
        queryKey: ['getTiposEmpleado'],
        queryFn: () => getTiposEmpleado(),
        refetchOnWindowFocus: false
    });
    const meses = useQuery({
        queryKey: ['getMeses'],
        queryFn: () => getMeses(),
        refetchOnWindowFocus: false
    });
    //utils
    const getNombreProyecto = getNombreById(proyectos.data ?? []);
    const getNombreTipoEmpleado = getNombreById(tiposEmpleado.data ?? []);
    //mutation
    const download = useMutation({
        mutationFn: (data: ExportFormData) => exportResumen(data),
        onSuccess: (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Resumen de Horas - ${watch('proyectos').map(proyecto => getNombreProyecto(proyecto)).join(', ')}${watch('id_tipoempleado') != '' ? ' - ' + getNombreTipoEmpleado(Number(watch('id_tipoempleado'))) : ''}${' - ' + getNombreById(getNombresMeses(meses.data ?? []))(Number(watch('id_mes')))}${watch('quincena') === 1 ? ' - Primera Quincena' : watch('quincena') === 2 ? ' - Segunda Quincena' : ''}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            showSuccess('Resumen exportado correctamente');
            router.push(`/rrhh/jornadas`);
        },
        onError: () => showError('Error al exportar resumen')
    });
    //feedback
    useEffect(() => {
        if (meses.isError) showWarning('Error al cargar meses');
        if (tiposEmpleado.isError) showWarning('Error al cargar tipos de empleado');
        if (proyectos.isError) showWarning('Error al cargar proyectos');
    }, [meses.isError, tiposEmpleado.isError, proyectos.isError, showWarning]);
    return (
        <form onSubmit={handleSubmit((data) => download.mutate(data))} className='flex flex-col items-center justify-between w-full h-full gap-3 sm:gap-4'>
            <div className='flex flex-col h-full w-full max-w-[650px] justify-center gap-2'>
                <ExportarFormInputs
                    control={control}
                    proyectos={proyectos.data ?? []}
                    tiposEmpleado={tiposEmpleado.data ?? []}
                    meses={meses.data ?? []}
                    isLoading={proyectos.isLoading || meses.isLoading || tiposEmpleado.isLoading}
                />
            </div>
            <div className='flex justify-between w-full'>
                <Button
                    component={Link}
                    variant='contained'
                    color='warning'
                    href={'/rrhh/jornadas'}
                    disableElevation
                    startIcon={
                        download.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <ArrowBackRoundedIcon />
                    }
                    disabled={download.isPending}
                >
                    Jornadas
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disableElevation
                    endIcon={
                        download.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <DownloadRoundedIcon />
                    }
                    disabled={download.isPending || !isValid}
                >
                    {!download.isPending ? 'Guardar' : 'Guardando'}
                </Button>
            </div>
        </form>
    );
};