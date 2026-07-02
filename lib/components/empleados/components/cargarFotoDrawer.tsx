import { useImageDropzone } from "@/lib/hooks/useImageDropzone";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, IconButton } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SyncIcon from '@mui/icons-material/Sync';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useState } from "react";
import { imageToJpeg } from "@/lib/utils/imageToJpeg";

export default function CargarFotoDrawer({
    nombre,
    descripcion,
    open,
    onClose,
    guardar,
    successMessage,
    queryKey
}: {
    nombre: string,
    descripcion?: string,
    open: boolean,
    onClose: () => void,
    guardar: (file: File) => Promise<unknown>,
    successMessage: string,
    queryKey: string
}) {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useSnackbar();
    const dropzone = useImageDropzone();
    const [preview, setPreview] = useState<string | null>(null);

    //preview de la imagen seleccionada (con limpieza del object URL)
    useEffect(() => {
        if (!dropzone.file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(dropzone.file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [dropzone.file]);

    const cargar = useMutation({
        mutationFn: (file: File) => guardar(file),
        onSuccess: () => {
            showSuccess(successMessage);
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            handleClose();
        },
        onError: (error) => showError(error instanceof Error ? error.message : 'Error al cargar la foto')
    });

    // Normaliza a JPEG antes de subir y dispara la carga.
    const handleGuardar = async () => {
        if (!dropzone.file) return;
        try {
            const jpeg = await imageToJpeg(dropzone.file);
            cargar.mutate(jpeg);
        } catch {
            showError('No se pudo procesar la imagen');
        }
    };

    const handleClose = () => {
        dropzone.deleteFile();
        onClose();
    };

    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        width: { xs: 'calc(100% - 8px)', sm: '400px' },
                        height: 'calc(100vh - 8px)',
                        bgcolor: '#FFFFFF',
                        margin: '4px',
                        border: '2px solid #f97316',
                        borderRadius: '5px'
                    },
                },
            }}
        >
            <div className='flex h-full flex-col'>
                <div className='flex items-start justify-between border-b border-gray-200 px-6 py-4'>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-800'>Cargar foto</h2>
                        <span className='block text-sm font-normal text-gray-500'>{nombre}</span>
                    </div>
                    <IconButton onClick={handleClose} disabled={cargar.isPending} size='small'>
                        <CloseRoundedIcon />
                    </IconButton>
                </div>
                <div className='flex-1 overflow-y-auto px-6 py-4'>
                    {descripcion && <p className='text-sm text-gray-600 mb-4'>{descripcion}</p>}
                    <div
                        {...dropzone.getRootProps()}
                        className={`border-1 border-solid rounded w-full p-6 text-center cursor-pointer transition-colors
                            ${dropzone.isDragActive ? 'border-orange-500 bg-orange-100' : 'border-gray-300 hover:border-gray-900'}
                            ${dropzone.error ? 'border-red-300 bg-red-100' : ''}`}
                    >
                        <input {...dropzone.getInputProps()} />
                        {!dropzone.file ? (
                            dropzone.isDragActive
                                ? <p className='text-orange-500'>Suelta la imagen aquí...</p>
                                : (
                                    <>
                                        <p className='text-gray-800 mb-2'>Clickea para subir o arrastra y suelta</p>
                                        <p className='text-sm text-gray-500'>Formatos: .jpg, .jpeg, .png</p>
                                    </>
                                )
                        ) : (
                            <div className='flex items-center justify-between bg-green-50 p-3 rounded border border-green-200'>
                                <div className='flex items-center gap-3'>
                                    {preview &&
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt='preview' className='w-12 h-12 object-cover rounded' />
                                    }
                                    <div className='text-left'>
                                        <p className='font-medium text-green-800'>{dropzone.file.name}</p>
                                        <p className='text-sm text-green-600'>{(dropzone.file.size / 1024).toFixed(0)} KB</p>
                                    </div>
                                </div>
                                <IconButton
                                    onClick={(e) => { e.stopPropagation(); dropzone.deleteFile(); }}
                                    color='error'
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </div>
                        )}
                    </div>
                    {dropzone.error && <p className='text-red-500 text-sm mt-2'>{dropzone.error}</p>}
                    {preview &&
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt='preview de la foto' className='mt-4 w-full rounded border border-gray-200 object-contain' />
                    }
                </div>
                <div className='flex justify-between border-t border-gray-200 px-6 py-4'>
                    <Button
                        variant='contained'
                        color='error'
                        disableElevation
                        onClick={handleClose}
                        disabled={cargar.isPending}
                        startIcon={
                            cargar.isPending
                                ? <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                                : <CloseRoundedIcon />
                        }
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        color='success'
                        disableElevation
                        disabled={!dropzone.file || cargar.isPending}
                        onClick={handleGuardar}
                        endIcon={
                            cargar.isPending
                                ? <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                                : <SaveAsRoundedIcon />
                        }
                    >
                        {!cargar.isPending ? 'Guardar' : 'Guardando'}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};
