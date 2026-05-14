import { useSnackbar } from "@/lib/contexts/snackbar";
import { useShow } from "@/lib/hooks/useShow";
import { TipoAusenciaItemDto } from "@/lib/types/tipoAusencia/get-tipoausencia-paginated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ConfiguracionTiposAusenciaTableRowFormData } from "../types/configuracionTiposAusenciaTableRowFromData";
import { deleteTipoAusencia, editTipoAusencia } from "@/lib/actions/tiposAusencia/tipoAusencia.actions";
import { Box, Chip, TableRow } from "@mui/material";
import { TableRowCell } from "../../common/tables/tableRowCell";
import { ControlledTextField } from "../../common/inputs/controlledTextField";
import { TableActionButton } from "../../common/components/tableActionButton";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';

export default function ConfiguracionTiposAusenciaTableRow({
    tipoAusencia
}: {
    tipoAusencia: TipoAusenciaItemDto
}) {
    //init 
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    const show = useShow();
    const { control, handleSubmit, setValue } = useForm<ConfiguracionTiposAusenciaTableRowFormData>({
        defaultValues: {
            nombre: ''
        }
    });
    //mutations
    const edit = useMutation({
        mutationFn: (data: {
            id: number,
            nombre: string
        }) => editTipoAusencia(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getTiposAusenciaPaginated']
            });
            showSuccess('Tipo de Ausencia editado correctamente');
            show.handleShow();
        },
        onError: () => showError('Error al editar el tipo de ausencia')
    });
    const remove = useMutation({
        mutationFn: (data: {
            id: number
        }) => deleteTipoAusencia(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getTiposAusenciaPaginated']
            });
            showSuccess('Tipo de Ausencia dado de baja correctamente');
        },
        onError: () => showError('Error al dar de baja tipo de ausencia')
    });
    return (
        <TableRow>
            <TableRowCell alignment='left'>
                {show.show ? (
                    <ControlledTextField
                        control={control}
                        name='nombre'
                        disabled={edit.isPending || remove.isPending}
                        label='Nombre'
                    />
                ) : (
                    tipoAusencia.nombre
                )}
            </TableRowCell>
            <TableRowCell alignment='center'>
                        <Chip
                            label={tipoAusencia.estadoparametro}
                            className='!rounded'
                            color={
                                tipoAusencia.estadoparametro!.toLowerCase() === 'activo' ? 'success' : 'error'
                            }
                        />
                    </TableRowCell>
            <TableRowCell alignment='right' variant='buttons'>
                <Box sx={{ display: 'flex' }}>
                    {show.show &&
                        <>
                            <TableActionButton
                                tooltip='Guardar'
                                icon={<SaveAsRoundedIcon />}
                                color='success'
                                loading={edit.isPending}
                                disabled={edit.isPending || tipoAusencia.estadoparametro === 'Baja'}
                                onClick={handleSubmit((data) => {
                                    edit.mutate({
                                        id: tipoAusencia.id,
                                        nombre: data.nombre
                                    });
                                })}
                                position='first'
                            />
                            <TableActionButton
                                tooltip='Cancelar'
                                icon={<CloseRoundedIcon />}
                                color='error'
                                loading={edit.isPending}
                                disabled={edit.isPending || tipoAusencia.estadoparametro === 'Baja'}
                                onClick={() => {
                                    show.handleShow();
                                }}
                                position='last'
                            />
                        </>
                    }
                    {!show.show &&
                        <>
                            <TableActionButton
                                tooltip='Editar'
                                icon={<EditRoundedIcon />}
                                color='info'
                                loading={edit.isPending}
                                disabled={edit.isPending || tipoAusencia.estadoparametro === 'Baja'}
                                onClick={() => {
                                    show.handleShow();
                                    setValue('nombre', tipoAusencia.nombre ?? '');
                                }}
                                position={'first'}
                            />
                            <TableActionButton
                                tooltip='¿Dar Baja?'
                                confirmTooltip='Confirmar'
                                icon={<DeleteRoundedIcon />}
                                color='error'
                                loading={remove.isPending}
                                disabled={edit.isPending || tipoAusencia.estadoparametro === 'Baja'}
                                onClick={() => remove.mutate({ id: tipoAusencia.id })}
                                position={'last'}
                            />
                        </>
                    }
                </Box>
            </TableRowCell>
        </TableRow>
    );
};