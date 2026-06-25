import { EmpleadoItemDto } from "@/lib/types/empleado/get-empleado";
import { useImageDropzone } from "@/lib/hooks/useImageDropzone";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cargarFotoAcceso } from "@/lib/actions/accesoControl/accesoControl.actions";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SyncIcon from '@mui/icons-material/Sync';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useState } from "react";

// Normaliza cualquier imagen a JPEG (y la achica si es muy grande) usando canvas.
// HikCentral exige JPEG con cara detectable y tamaño acotado; esto evita
// rechazos por formato (PNG, etc.) o por resolución excesiva.
function toJpeg(file: File, maxDim = 1280, quality = 0.92): Promise<File> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            const max = Math.max(width, height);
            if (max > maxDim) {
                const scale = maxDim / max;
                width = Math.round(width * scale);
                height = Math.round(height * scale);
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('No se pudo procesar la imagen'));
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => blob
                    ? resolve(new File([blob], 'foto.jpg', { type: 'image/jpeg' }))
                    : reject(new Error('No se pudo procesar la imagen')),
                'image/jpeg',
                quality
            );
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')); };
        img.src = url;
    });
}

export default function CargarFotoDialog({
    empleado,
    open,
    onClose
}: {
    empleado: EmpleadoItemDto,
    open: boolean,
    onClose: () => void
}) {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useSnackbar();
    const dropzone = useImageDropzone();
    const [preview, setPreview] = useState<string | null>(null);

    const yaSincronizado = empleado.estado_acceso === 'Sincronizado';

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
        mutationFn: (file: File) => cargarFotoAcceso({ id: empleado.id, file }),
        onSuccess: () => {
            showSuccess(yaSincronizado ? 'Foto actualizada correctamente' : 'Empleado sincronizado con control de acceso');
            queryClient.invalidateQueries({ queryKey: ['getEmpleados'] });
            handleClose();
        },
        onError: (error) => showError(error instanceof Error ? error.message : 'Error al cargar la foto')
    });

    // Normaliza a JPEG antes de subir y dispara la carga.
    const handleGuardar = async () => {
        if (!dropzone.file) return;
        try {
            const jpeg = await toJpeg(dropzone.file);
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
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth='xs'
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: '8px' } } }}
        >
            <DialogTitle className='!text-lg !font-semibold !text-gray-800 !border-b !border-gray-200'>
                Cargar foto
                <span className='block text-sm font-normal text-gray-500'>{empleado.nombre}</span>
            </DialogTitle>
            <DialogContent className='!pt-4'>
                <p className='text-sm text-gray-600 mb-4'>
                    {yaSincronizado
                        ? 'Se reemplazará la foto actual en el control de acceso.'
                        : 'Se dará de alta en el control de acceso con acceso a todas las obras.'}
                </p>
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
            </DialogContent>
            <DialogActions className='!px-6 !pb-4 !justify-between'>
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
            </DialogActions>
        </Dialog>
    );
};
