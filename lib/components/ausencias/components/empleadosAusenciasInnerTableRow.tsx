import { JornadaItemDto } from "@/lib/types/jornada/get-jornada"
import { Box, TableRow } from "@mui/material"
import { TableRowCell } from "../../common/tables/tableRowCell"
import { formatFechaDiaSemana } from "@/lib/utils/formatFechaDiaSemana"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteJornada, editJornadaTipoAusencia } from "@/lib/actions/jornada/jornada.actions"
import { useSnackbar } from "@/lib/contexts/snackbar"
import { createObservacion, deleteObservacion } from "@/lib/actions/observacion/observacion.actions"
import { useShow } from "@/lib/hooks/useShow"
import { useForm } from "react-hook-form"
import { getDay } from "@/lib/utils/getDay"
import { EmpleadosAusenciasInnerTableRowFormData } from "../type/empleadosAusenciasInnerTableRowFormData"
import { TableActionButton } from "../../common/components/tableActionButton"
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ObservacionesTooltip } from "../../common/components/observacionesTooltip"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useUserRole } from "@/lib/hooks/useUserRole"
import { TipoAusencia } from "@/lib/types/tipoAusencia/tipoAusencia.entity"
import { ControlledSelect } from "../../common/inputs/controlledSelect"
import { ControlledTextField } from "../../common/inputs/controlledTextField"

export default function EmpleadosAusenciasInnerTableRow({
    ausencia,
    tiposAusencia
}: {
    ausencia: JornadaItemDto,
    tiposAusencia: TipoAusencia[]
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    const { isAdministrativo } = useUserRole();
    const showObservacion = useShow();
    const showEdit = useShow();
    const { control, handleSubmit, formState: { isValid }, resetField, setValue } = useForm<EmpleadosAusenciasInnerTableRowFormData>({
        defaultValues: {
            id_tipoausencia: ausencia.id_tipoausencia ?? '',
            observacion: ''
        }
    });
    //utils
    const day = getDay(ausencia.fecha);
    //mutations
    const justify = useMutation({
        mutationFn: (data: {
            id: number,
            id_tipoausencia: number | ''
        }) => editJornadaTipoAusencia(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getAusenciasEmpleado']
            });
            showSuccess('Ausencia justificada correctamente');
            showEdit.handleShow();
        },
        onError: () => showError('Error al justificar ausencia')
    });
    const removeJornada = useMutation({
        mutationFn: (data: {
            id: number
        }) => deleteJornada(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getAusenciasEmpleado']
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
                queryKey: ['getAusenciasEmpleado']
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
                queryKey: ['getAusenciasEmpleado']
            });
            showSuccess('Observación eliminada correctamente');
        },
        onError: () => showError('Error al eliminar observación')
    });
    return (
        <TableRow>
            <TableRowCell alignment='left' position='first' color={day === 0 ? 'gray' : day === 1 ? 'green' : undefined}>
                {formatFechaDiaSemana(ausencia.fecha)}
            </TableRowCell>
            {showObservacion.show ? (
                <TableRowCell alignment='center' span={2}>
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
                            <ControlledSelect
                                control={control}
                                name='id_tipoausencia'
                                label='Tipo de Ausencia'
                                disabled={tiposAusencia.length === 0 || !tiposAusencia}
                                items={tiposAusencia}
                            />
                        ) : (
                            ausencia.tipoausencia
                        )}
                    </TableRowCell>
                    <TableRowCell alignment='center' variant='buttons'>
                        <ObservacionesTooltip observaciones={(ausencia.observaciones ?? []).map((observacion) => ({ id_jornada: ausencia.id, id: observacion.id, texto: observacion.texto }))} onDelete={(id: number) => removeObservacion.mutate({ id })} sx={{ borderRadius: '4px 4px 4px 4px' }} />
                    </TableRowCell>
                </>
            )}
            <TableRowCell alignment='right' variant='buttons' position='last' color={day === 0 ? 'gray' : day === 1 ? 'green' : undefined}>
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
                                    if (showEdit.show) justify.mutate({
                                        id: ausencia.id,
                                        id_tipoausencia: data.id_tipoausencia
                                    });
                                    if (showObservacion.show) create.mutate({
                                        observacion: data.observacion,
                                        id_jornada: ausencia.id
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
                            <TableActionButton
                                tooltip='Añadir Observación'
                                icon={<AddRoundedIcon />}
                                color='warning'
                                onClick={() => {
                                    showObservacion.handleShow();
                                    resetField('observacion');
                                }}
                                position='first'
                            />
                            <TableActionButton
                                tooltip='Justificar'
                                icon={<EditRoundedIcon />}
                                color='info'
                                loading={justify.isPending}
                                disabled={justify.isPending || removeJornada.isPending}
                                onClick={() => {
                                    showEdit.handleShow();
                                    setValue('id_tipoausencia', ausencia.id_tipoausencia ?? '');
                                }}
                                position={isAdministrativo ? 'last' : 'middle'}
                            />
                            {!isAdministrativo &&
                                <>
                                    <TableActionButton
                                        tooltip='¿Borrar?'
                                        confirmTooltip='Confirmar'
                                        icon={<DeleteForeverRoundedIcon />}
                                        color='error'
                                        loading={removeJornada.isPending}
                                        disabled={justify.isPending || removeJornada.isPending}
                                        onClick={() => removeJornada.mutate({ id: ausencia.id })}
                                        position='last'
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