import { Button } from "@mui/material";
import SyncIcon from '@mui/icons-material/Sync';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { ControlledSelect } from "../../common/inputs/controlledSelect";
import { ControlledTextField } from "../../common/inputs/controlledTextField";
import { Proyecto } from "@/lib/types/proyecto/proyecto.entity";
import { ConfiguracionControlesFormData } from "../types/configuracionControlesFormData";
import { createControl } from "@/lib/actions/control/control.actions";

export default function ConfiguracionControlesForm({
    proyectos,
    handleShow
}: {
    proyectos: Proyecto[],
    handleShow: () => void
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showError, showSuccess } = useSnackbar();
    const { control, handleSubmit, formState: { isValid } } = useForm<ConfiguracionControlesFormData>({
        defaultValues: {
            serie: '',
            id_proyecto: ''
        }
    });
    //mutations
    const create = useMutation({
        mutationFn: (data: ConfiguracionControlesFormData) => createControl({
            serie: data.serie,
            id_proyecto: data.id_proyecto
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getControles']
            });
            showSuccess('Control creado correctamente');
            handleShow();
        },
        onError: () => showError('Error al crear control')
    });
    return (
        <form onSubmit={handleSubmit((data) => create.mutate(data))} className='flex flex-col items-center justify-between w-full h-full gap-3 sm:gap-4'>
            <div className='flex flex-col h-full w-full mt-2 justify-center gap-2'>
                <ControlledTextField
                    control={control}
                    name='serie'
                    label='Número de Serie'
                    rules={{ required: 'Debe ingresar un número de serie' }}
                    disabled={create.isPending}
                />
                <ControlledSelect
                    control={control}
                    name='id_proyecto'
                    label='Proyecto'
                    rules={{ required: 'Debe seleccionar un proyecto' }}
                    disabled={proyectos.length === 0 || create.isPending}
                    items={proyectos}
                />
            </div>
            <div className='flex justify-between w-full'>
                <Button
                    variant='contained'
                    color='error'
                    disableElevation
                    onClick={handleShow}
                    startIcon={
                        create.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <CloseRoundedIcon />
                    }
                    disabled={create.isPending}
                >
                    Cancelar
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disableElevation
                    endIcon={
                        create.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <SaveAsRoundedIcon />
                    }
                    disabled={!isValid || create.isPending}
                >
                    {!create.isPending ? 'Guardar' : 'Guardando'}
                </Button>
            </div>
        </form>
    );
};
