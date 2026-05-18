import { useSnackbar } from "@/lib/contexts/snackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form";
import { ConfiguracionProyectosFormData } from "../types/configuracionProyectosFormData";
import { createProyecto } from "@/lib/actions/proyecto/proyecto.actions";
import { Button } from "@mui/material";
import SyncIcon from '@mui/icons-material/Sync';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ControlledTextField } from "../../common/inputs/controlledTextField";
import { ModalidadTrabajo } from "@/lib/types/modalidadTrabajo/modalidadTrabajo.entity";
import { ModalidadImportacion } from "@/lib/types/modalidadImportacion/modalidadImportacion.entity";
import { ControlledSelect } from "../../common/inputs/controlledSelect";

export default function ConfiguracionProyectoForm({
    handleShow,
    modalidadesTrabajo,
    modalidadesImportacion
}: {
    handleShow: () => void
    modalidadesTrabajo: ModalidadTrabajo[],
    modalidadesImportacion: ModalidadImportacion[]
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showError, showSuccess } = useSnackbar();
    const { control, handleSubmit, formState: { isValid } } = useForm<ConfiguracionProyectosFormData>({
        defaultValues: {
            nombre: '',
            nomina: '',
            id_modalidadtrabajo: '',
            id_modalidadimportacion: ''
        }
    });
    //mutations
    const create = useMutation({
        mutationFn: (data: ConfiguracionProyectosFormData) => createProyecto({
            nombre: data.nombre,
            nomina: data.nomina,
            id_modalidadimportacion: Number(data.id_modalidadimportacion),
            id_modalidadtrabajo: Number(data.id_modalidadtrabajo)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getProyectosPaginated']
            });
            showSuccess('Proyecto creado correctamente');
            handleShow();
        },
        onError: () => showError('Error al crear proyecto')
    });
    return (
        <form onSubmit={handleSubmit((data) => create.mutate(data))} className='flex flex-col items-center justify-between w-full h-full gap-3 sm:gap-4'>
            <div className='flex flex-col h-full w-full mt-2 justify-center gap-2'>
                <div className='flex flex-row w-full gap-2 items-center'>
                    <ControlledTextField
                        control={control}
                        name='nombre'
                        label='Nombre'
                        rules={{ required: 'Debe ingresar un nombre' }}
                        disabled={create.isPending}
                    />
                    <ControlledTextField
                        control={control}
                        name='nomina'
                        label='Nombre en Nomina'
                        disabled={create.isPending}
                    />
                </div>
                <div className='flex flex-row w-full gap-2 items-center'>
                    <ControlledSelect
                        control={control}
                        name='id_modalidadtrabajo'
                        label='Modalidad de Trabajo'
                        rules={{ required: 'Debe seleccionar una modalidad de trabajo' }}
                        disabled={create.isPending || modalidadesTrabajo.length === 0}
                        items={modalidadesTrabajo}
                    />
                    <ControlledSelect
                        control={control}
                        name='id_modalidadimportacion'
                        label='Modalidad de Importación'
                        rules={{ required: 'Debe seleccionar una modalidad de importación' }}
                        disabled={create.isPending || modalidadesImportacion.length === 0}
                        items={modalidadesImportacion}
                    />
                </div>
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