'use client'

import { useSnackbar } from "@/lib/contexts/snackbar";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ImportFormData } from "./types/importFormData";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { useEffect } from "react";
import { getTiposJornada } from "@/lib/actions/tipoJornada/tipoJornada.actions";
import { getTiposImportacion } from "@/lib/actions/tipoImportacion/tipoImportacion.actions";
import ImportarFormInputs from "./components/importarFormInputs";
import { useDropzone } from "@/lib/hooks/useDropzone";
import ImportarFormDropzone from "./components/importarFormDropzone";
import Link from "next/link";
import { Button } from "@mui/material";
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import SyncIcon from '@mui/icons-material/Sync';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { importHikVision, importProsoft } from "@/lib/actions/features/import/import.actions";

export default function Importar() {
    //init
    const router = useRouter();
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError, showWarning } = useSnackbar();
    const { control, handleSubmit, formState: { isValid, errors }, reset, watch, setValue } = useForm<ImportFormData>({
        defaultValues: {
            id_proyecto: '',
            id_tipojornada: '',
            id_tipoimportacion: '',
            fecha: 'string',
            file: null
        }
    });
    const dropzone = useDropzone();
    //query
    const proyectos = useQuery({
        queryKey: ['getProyectos'],
        queryFn: () => getProyectos(),
        refetchOnWindowFocus: false
    });
    const tiposJornada = useQuery({
        queryKey: ['getTiposJornada'],
        queryFn: () => getTiposJornada(),
        refetchOnWindowFocus: false
    });
    const tiposImportacion = useQuery({
        queryKey: ['getTiposImportaciones'],
        queryFn: () => getTiposImportacion(),
        refetchOnWindowFocus: false
    });
    //mutation
    const load = useMutation({
        mutationFn: (data: ImportFormData) => {
            if (data.id_tipoimportacion === 1) {
                return importProsoft({
                    file: data.file!,
                    id_proyecto: data.id_proyecto,
                    id_tipojornada: data.id_tipojornada,
                });
            } else {
                return importHikVision({
                    fecha: data.fecha,
                    id_proyecto: data.id_proyecto,
                    id_tipojornada: data.id_tipojornada,
                });
            }
        },
        onSuccess: (response) => {
            showSuccess('Jornadas importadas correctamente');
            router.push(`/administrativo/importacion/${response}/completar`);
            queryClient.invalidateQueries({
                queryKey: ['fetchImportaciones']
            });
            reset();
        },
        onError: () => showError('Error al importar jornada')
    })
    //feedback
    useEffect(() => {
        if (proyectos.isError) showWarning('Error al cargar proyectos');
        if (tiposJornada.isError) showWarning('Error al cargar tipos de jornada');
        if (tiposImportacion.isError) showWarning('Error al cargar tipos de importacion');
    }, [proyectos.isError, tiposJornada.isError, tiposImportacion.isError, showWarning]);
    //effects
    useEffect(() => {
        setValue('file', dropzone.file);
    }, [dropzone.file, setValue]);
    return (
        <form onSubmit={handleSubmit((data) => load.mutate(data))} className='flex flex-col items-center justify-between w-full h-full gap-3 sm:gap-4'>
            <div className='flex flex-col h-full w-full max-w-[650px] justify-center gap-2'>
                <ImportarFormInputs
                    control={control}
                    proyectos={proyectos.data ?? []}
                    tiposJornada={tiposJornada.data ?? []}
                    tiposImportacion={tiposImportacion.data ?? []}
                    isLoading={proyectos.isLoading || tiposJornada.isLoading || tiposImportacion.isLoading}
                    watch={watch}
                />
                {watch('id_tipoimportacion') === 1 &&
                    <ImportarFormDropzone
                        getRootProps={dropzone.getRootProps}
                        getInputProps={dropzone.getInputProps}
                        isDragActive={dropzone.isDragActive}
                        deleteFile={dropzone.deleteFile}
                        file={watch('file')}
                        errors={errors}
                    />
                }
            </div>
            <div className='flex justify-between w-full'>
                <Button
                    component={Link}
                    variant='contained'
                    color='warning'
                    href={'/administrativo/importaciones'}
                    disableElevation
                    startIcon={
                        load.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <ArrowBackRoundedIcon />
                    }
                    disabled={load.isPending}
                >
                    Importaciones
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disableElevation
                    endIcon={
                        load.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <UploadFileRoundedIcon />
                    }
                    disabled={load.isPending || !isValid || (watch('id_tipoimportacion') === 1 && !watch('file'))}
                >
                    {!load.isPending ? 'Guardar' : 'Guardando'}
                </Button>
            </div>
        </form>
    );
};