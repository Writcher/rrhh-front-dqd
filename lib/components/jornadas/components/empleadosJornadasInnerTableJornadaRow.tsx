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
import { TableTooltip } from "../../common/components/tableTooltip"
import { TableActionButton } from "../../common/components/tableActionButton"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { getDay } from "@/lib/utils/getDay"
import { useUserRole } from "@/lib/hooks/useUserRole"
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

export default function EmpleadosJornadasInnerTableJornadaRow({
    jornada
}: {
    jornada: JornadaItemDto
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    const { isAdministrativo } = useUserRole();
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
    //const
    const hasObservaciones = (jornada.observaciones?.length ?? 0) > 0;
    const hasAuditorias = (jornada.auditorias?.length ?? 0) > 0;
    const addObsPosition = (hasAuditorias || hasObservaciones)
        ? (isAdministrativo ? 'last' : 'middle')
        : (isAdministrativo ? 'only' : 'first');
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
            <TableRowCell alignment='left' position='first' color={day === 0 ? 'gray' : day === 1 ? 'green' : undefined} label='Fecha'>
                {formatFechaDiaSemana(jornada.fecha)}
            </TableRowCell>
            {showObservacion.show ? (
                <TableRowCell alignment='center' span={7} label='Observación'>
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
                    <TableRowCell alignment='center' label='Entrada'>
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
                    <TableRowCell alignment='center' label='Entrada Real'>
                        {jornada.entrada_r}
                    </TableRowCell>
                    <TableRowCell alignment='center' label='Salida'>
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
                    <TableRowCell alignment='center' label='Salida Real'>
                        {jornada.salida_r}
                    </TableRowCell>
                    <TableRowCell alignment='center' label='Total'>
                        {formatHorasMinutos(jornada.total)}
                    </TableRowCell>
                    <TableRowCell alignment='center' label='Tipo Jornada'>
                        {jornada.tipojornada}
                    </TableRowCell>
                    <TableRowCell alignment='center' label='Tipo Ausencia'>
                        {jornada.tipoausencia}
                    </TableRowCell>
                </>
            )}
            <TableRowCell alignment='right' variant='buttons' position='last' color={day === 0 ? 'gray' : day === 1 ? 'green' : undefined}>
                {(!showEdit.show && !showObservacion.show) && jornada.es_manual &&
                    <div className='hidden md:flex'>
                        <PulsingWarning />
                    </div>
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
                            <TableTooltip
                                title='Auditoría: '
                                items={jornada.auditorias ?? []}
                                columns={[
                                    { header: 'Fecha', render: (a) => new Date(a.fecha).toLocaleString() },
                                    { header: 'Usuario', render: (a) => a.usuario },
                                    { header: 'Entrada Anterior', render: (a) => a.entrada_anterior ?? '—' },
                                    { header: 'Salida Anterior', render: (a) => a.salida_anterior ?? '—' },
                                ]}
                                position='first'
                                icon={<HistoryRoundedIcon/>}
                                color='info'
                            />
                            <TableTooltip
                                title='Observaciones: '
                                items={jornada.observaciones ?? []}
                                columns={[{ render: (o) => `• ${o.texto}` }]}
                                onDelete={(id: number) => removeObservacion.mutate({ id })}
                                position={hasAuditorias ? 'middle' : 'first'}
                            />
                            <TableActionButton
                                tooltip='Añadir Observación'
                                icon={<AddRoundedIcon />}
                                color='warning'
                                onClick={() => {
                                    showObservacion.handleShow();
                                    resetField('observacion');
                                }}
                                position={addObsPosition}
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