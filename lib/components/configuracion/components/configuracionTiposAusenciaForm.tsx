import { useSnackbar } from "@/lib/contexts/snackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form";
import { ConfiguracionTiposAusenciaFormData } from "../types/configuracionTiposAusenciaFormData";
import { createTipoAusencia } from "@/lib/actions/tiposAusencia/tipoAusencia.actions";
import SyncIcon from '@mui/icons-material/Sync';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button } from "@mui/material";
import { ControlledTextField } from "../../common/inputs/controlledTextField";

export default function ConfiguracionTiposAusenciaForm({
    handleShow
}: {
    handleShow: () => void
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showError, showSuccess } = useSnackbar();
    const { control, handleSubmit, formState: { isValid } } = useForm<ConfiguracionTiposAusenciaFormData>({
        defaultValues: {
            nombre: ''
        }
    });
    //mutations
    const create = useMutation({
        mutationFn: (data: ConfiguracionTiposAusenciaFormData) => createTipoAusencia({
            nombre: data.nombre
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getTiposAusenciaPaginated']
            });
            showSuccess('Tipo de ausencia creada correctamente');
            handleShow();
        },
        onError: () => showError('Error al crear tipo de ausencia')
    });
    return (
        <form onSubmit={handleSubmit((data) => create.mutate(data))} className='flex flex-col items-center justify-between w-full h-full gap-3 sm:gap-4'>
            <div className='flex flex-col h-full w-full mt-2 justify-center gap-2'>
                <ControlledTextField
                    control={control}
                    name='nombre'
                    label='Nombre'
                    rules={{ required: 'Debe ingresar un nombre' }}
                    disabled={create.isPending}
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