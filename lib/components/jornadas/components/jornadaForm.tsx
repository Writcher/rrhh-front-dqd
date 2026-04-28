import { Button, FormControlLabel, Switch } from "@mui/material";
import SyncIcon from '@mui/icons-material/Sync';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { EmpleadoJornadaFormData } from "../types/empleadosJornadaFormData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { createJornada } from "@/lib/actions/jornada/jornada.actions";
import { getTiposJornada } from "@/lib/actions/tipoJornada/tipoJornada.actions";
import { getTiposAusencia } from "@/lib/actions/tiposAusencia/tipoAusencia.actions";
import { useShow } from "@/lib/hooks/useShow";
import { ControlledSelect } from "../../common/inputs/controlledSelect";
import { getIdByNombre } from "@/lib/utils/getIdByNombre";
import { ControlledDatePicker } from "../../common/inputs/controlledDatePicker";
import { ControlledTimePicker } from "../../common/inputs/controlledTimePicker";
import { ControlledTextField } from "../../common/inputs/controlledTextField";

export default function JornadaForm({
    id_empleado,
    handleShow
}: {
    id_empleado: number,
    handleShow: () => void
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showError, showSuccess, showWarning } = useSnackbar()
    const { watch, control, handleSubmit, formState: { isValid }, setValue } = useForm<EmpleadoJornadaFormData>({
        defaultValues: {
            id_tipojornada: '',
            id_tipoausencia: '',
            fecha: '',
            entrada: '',
            salida: '',
            entradaTarde: '',
            salidaTarde: '',
            observacion: ''
        }
    });
    const show = useShow();
    //query
    const tiposJornada = useQuery({
        queryKey: ['getTiposJornada'],
        queryFn: () => getTiposJornada(),
        refetchOnWindowFocus: false
    });
    const tiposAusencia = useQuery({
        queryKey: ['getTiposAusencia'],
        queryFn: () => getTiposAusencia(),
        refetchOnWindowFocus: false
    });
    //utils
    const getTipoJornadaId = getIdByNombre(tiposJornada.data ?? []);
    const isAusencia = watch('id_tipojornada') === getTipoJornadaId('Ausencia');
    //effects
    useEffect(() => {
        if (isAusencia) {
            setValue('entrada', '');
            setValue('salida', '');
            setValue('entradaTarde', '');
            setValue('salidaTarde', '');
        } else {
            setValue('id_tipoausencia', '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAusencia]);
    //mutations
    const load = useMutation({
        mutationFn: (data: EmpleadoJornadaFormData) => createJornada({
            id_tipojornada: data.id_tipojornada,
            id_tipoausencia: data.id_tipoausencia,
            fecha: data.fecha,
            entrada: data.entrada,
            salida: data.salida,
            entradaTarde: data.entradaTarde,
            salidaTarde: data.salidaTarde,
            observacion: data.observacion,
            id_empleado: id_empleado
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getJornadasEmpleado']
            });
            showSuccess('Jornada creada correctamente');
            handleShow();
        },
        onError: () => showError('Error al crear jornada')
    });
    return (
        <form onSubmit={handleSubmit((data) => load.mutate(data))} className='flex flex-col items-center justify-between w-full h-full gap-3 sm:gap-4'>
            <div className='flex flex-col h-full w-full mt-2 justify-center gap-2'>
                <div className='flex flex-row w-full gap-2 items-center'>
                    <div className={isAusencia ? 'w-1/2' : 'w-2/3'}>
                        <ControlledSelect
                            control={control}
                            name='id_tipojornada'
                            label='Tipo de Jornada'
                            rules={{ required: 'Debe seleccionar un tipo de jornada' }}
                            isLoading={tiposJornada.isLoading}
                            disabled={tiposJornada.data?.length === 0}
                            items={tiposJornada.data ?? []}
                        />
                    </div>
                    {isAusencia &&
                        <div className='w-1/2'>
                            <ControlledSelect
                                control={control}
                                name='id_tipoausencia'
                                label='Tipo de Ausencia'
                                rules={isAusencia ? { required: 'Debe seleccionar un tipo de ausencia' } : undefined}
                                isLoading={tiposAusencia.isLoading}
                                disabled={tiposAusencia.data?.length === 0}
                                items={tiposAusencia.data ?? []}
                            />
                        </div>
                    }
                    {!isAusencia &&
                        <div className='w-1/3 flex justify-center'>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={show.show}
                                        onChange={show.handleShow}
                                        color='warning'
                                    />
                                }
                                label='Jornada Partida'
                                className='!text-gray-700'
                            />
                        </div>
                    }
                </div>
                <ControlledDatePicker
                    control={control}
                    name='fecha'
                    label='Fecha'
                    rules={{ required: 'Debe seleccionar una fecha' }}
                />
                {!isAusencia &&
                    <>
                        <div className='flex flex-row w-full gap-2 items-center'>
                            <ControlledTimePicker
                                control={control}
                                name='entrada'
                                rules={{ required: 'Este campo es requerido' }}
                                label={show.show ? 'Entrada turno Mañana' : 'Entrada'}
                            />
                            <ControlledTimePicker
                                control={control}
                                name='salida'
                                rules={{ required: 'Este campo es requerido' }}
                                label={show.show ? 'Salida turno Mañana' : 'Salida'}
                            />
                        </div>
                        {show.show &&
                            <div className='flex flex-row w-full gap-2 items-center'>
                                <ControlledTimePicker
                                    control={control}
                                    name='entradaTarde'
                                    rules={{ required: 'Este campo es requerido' }}
                                    label='Entrada turno Tarde'
                                />
                                <ControlledTimePicker
                                    control={control}
                                    name='salidaTarde'
                                    rules={{ required: 'Este campo es requerido' }}
                                    label='Salida turno Tarde'
                                />
                            </div>
                        }
                    </>
                }
                <ControlledTextField
                    control={control}
                    name='observacion'
                    label='Observación'
                    multiline
                    rows={3}
                />
            </div>
            <div className='flex justify-between w-full'>
                <Button
                    variant='contained'
                    color='error'
                    disableElevation
                    onClick={() => {
                        handleShow();
                    }}
                    startIcon={
                        load.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <CloseRoundedIcon />
                    }
                    disabled={load.isPending}
                >
                    Cancelar
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disableElevation
                    endIcon={
                        load.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <SaveAsRoundedIcon />
                    }
                    disabled={!isValid || load.isPending}
                >
                    {!load.isPending ? 'Guardar' : 'Guardando'}
                </Button>
            </div>
        </form>
    )
}