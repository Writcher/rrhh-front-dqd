import { JornadaItemDto } from "@/lib/types/jornada/get-jornada"
import { Box, TableRow } from "@mui/material"
import { TableRowCell } from "../../common/tables/tableRowCell"
import { formatFechaDiaSemana } from "@/lib/utils/formatFechaDiaSemana"
import { formatHorasMinutos } from "@/lib/utils/formatHorasMinutos"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteJornada, editJornada } from "@/lib/actions/jornada/jornada.actions"
import { useSnackbar } from "@/lib/contexts/snackbar"
import { createObservacion, deleteObservacion } from "@/lib/actions/observacion/observacion.actions"
import { useShow } from "@/lib/hooks/useShow"
import { useForm } from "react-hook-form"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { EmpleadosJornadasInnerTableJornadaRowFormData } from "../types/empleadosJornadasInnerTableJornadaRowFormData"
import { ControlledTimePicker } from "../../common/inputs/controlledTimePicker"
import { ControlledTextField } from "../../common/inputs/controlledTextField"
import { PulsingWarning } from "../../common/components/warning"
import { ObservacionesTooltip } from "../../common/components/observacionesTooltip"
import { TableActionButton } from "../../common/components/tableActionButton"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { getDay } from "@/lib/utils/getDay"

export default function EmpleadosJornadasInnerTableJornadaRow({
    jornada,
    isAdministrativo
}: {
    jornada: JornadaItemDto,
    isAdministrativo: boolean
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    const showObservacion = useShow();
    const showEdit = useShow();
    const { control, handleSubmit, formState: { isValid }, resetField, setValue } = useForm<EmpleadosJornadasInnerTableJornadaRowFormData>({
        defaultValues: {
            entrada: jornada.entrada ?? '',
            salida: jornada.salida ?? '',
            observacion: ''
        }
    });
    //utils
    const day = getDay(jornada.fecha);
    //mutations
    const edit = useMutation({
        mutationFn: (data: {
            id: number,
            entrada: string,
            salida: string
        }) => editJornada(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getJornadasEmpleado']
            });
            showSuccess('Jornada editada correctamente');
            showEdit.handleShow();
        },
        onError: () => showError('Error al editar la jornada')
    });
    const removeJornada = useMutation({
        mutationFn: (data: {
            id: number
        }) => deleteJornada(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getJornadasEmpleado']
            });
            showSuccess('Jornada eliminada correctamente');
        },
        onError: () => showError('Error al eliminar jornada')
    });
    const create = useMutation({
        mutationFn: (data: {
            observacion: string,
            id_jornada: number
        }) => createObservacion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getJornadasEmpleado']
            });
            showSuccess('Observación creada correctamente');
            showObservacion.handleShow();
        },
        onError: () => showError('Error al crear observación')
    });
    const removeObservacion = useMutation({
        mutationFn: (data: {
            id: number
        }) => deleteObservacion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getJornadasEmpleado']
            });
            showSuccess('Observación eliminada correctamente');
        },
        onError: () => showError('Error al eliminar observación')
    });
    return (
        <TableRow>
            <TableRowCell alignment='left' position='first' color={day === 0 ? 'gray' : day === 1 ? 'green' : undefined}>
                {formatFechaDiaSemana(jornada.fecha)}
            </TableRowCell>
            {showObservacion.show ? (
                <TableRowCell alignment='center' span={7}>
                    <ControlledTextField
                        control={control}
                        name='observacion'
                        rules={{ required: 'Debe ingresar la observacion' }}
                        disabled={create.isPending}
                        label='Observación'
                    />
                </TableRowCell>
            ) : (
                <>
                    <TableRowCell alignment='center'>
                        {showEdit.show ? (
                            <ControlledTimePicker
                                control={control}
                                name='entrada'
                                rules={{ required: jornada.entrada ? false : 'Este campo es requerido' }}
                                label='Entrada'
                            />
                        ) : (
                            jornada.entrada
                        )}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        {jornada.entrada_r}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        {showEdit.show ? (
                            <ControlledTimePicker
                                control={control}
                                name='salida'
                                rules={{ required: jornada.salida ? false : 'Este campo es requerido' }}
                                label='Salida'
                            />
                        ) : (
                            jornada.salida
                        )}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        {jornada.salida_r}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        {formatHorasMinutos(jornada.total)}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        {jornada.tipojornada}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        {jornada.tipoausencia}
                    </TableRowCell>
                </>
            )}
            <TableRowCell alignment='right' variant='buttons' position='last' color={day === 0 ? 'gray' : day === 1 ? 'green' : undefined}>
                {(!showEdit.show && !showObservacion.show)
                    ? jornada.es_manual
                        ? <PulsingWarning />
                        : null
                    : null
                }
                <Box sx={{ display: 'flex' }}>
                    {(showObservacion.show || showEdit.show) &&
                        <>
                            <TableActionButton
                                tooltip='Guardar'
                                icon={<SaveAsRoundedIcon />}
                                color='success'
                                loading={create.isPending}
                                disabled={create.isPending || !isValid}
                                onClick={handleSubmit((data) => {
                                    if (showEdit.show) edit.mutate({
                                        id: jornada.id,
                                        entrada: data.entrada,
                                        salida: data.salida
                                    });
                                    if (showObservacion.show) create.mutate({
                                        observacion: data.observacion,
                                        id_jornada: jornada.id
                                    });
                                })}
                                position='first'
                            />
                            <TableActionButton
                                tooltip='Cancelar'
                                icon={<CloseRoundedIcon />}
                                color='error'
                                loading={create.isPending}
                                disabled={create.isPending}
                                onClick={() => {
                                    if (showEdit.show) showEdit.handleShow();
                                    if (showObservacion.show) showObservacion.handleShow();
                                }}
                                position='last'
                            />
                        </>
                    }
                    {(!showEdit.show && !showObservacion.show) &&
                        <>
                            <ObservacionesTooltip observaciones={(jornada.observaciones ?? []).map((observacion) => ({ id_jornada: jornada.id, id: observacion.id, texto: observacion.texto }))} onDelete={(id: number) => removeObservacion.mutate({ id })} sx={{ borderRadius: '4px 0 0 4px' }} />
                            <TableActionButton
                                tooltip='Añadir Observación'
                                icon={<AddRoundedIcon />}
                                color='warning'
                                onClick={() => {
                                    showObservacion.handleShow();
                                    resetField('observacion');
                                }}
                                position={jornada.observaciones?.length ? (isAdministrativo ? 'last' : 'middle') : (isAdministrativo ? 'only' : 'first')}
                            />
                            {!isAdministrativo &&
                                <>
                                    < TableActionButton
                                        tooltip='Editar'
                                        icon={<EditRoundedIcon />}
                                        color='info'
                                        loading={edit.isPending}
                                        disabled={edit.isPending || removeJornada.isPending || jornada.tipoausencia != null}
                                        onClick={() => {
                                            showEdit.handleShow();
                                            setValue('entrada', jornada.entrada ?? '');
                                            setValue('salida', jornada.salida ?? '');
                                        }}
                                        position={'middle'}
                                    />
                                    <TableActionButton
                                        tooltip='¿Borrar?'
                                        confirmTooltip='Confirmar'
                                        icon={<DeleteForeverRoundedIcon />}
                                        color='error'
                                        loading={removeJornada.isPending}
                                        disabled={edit.isPending || removeJornada.isPending}
                                        onClick={() => removeJornada.mutate({ id: jornada.id })}
                                        position={'last'}
                                    />
                                </>
                            }
                        </>
                    }
                </Box>
            </TableRowCell>
        </TableRow>
    )
}