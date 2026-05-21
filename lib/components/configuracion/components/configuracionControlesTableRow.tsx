import { useSnackbar } from "@/lib/contexts/snackbar";
import { useShow } from "@/lib/hooks/useShow";
import { ControlesItemDto } from "@/lib/types/control/get-control";
import { Proyecto } from "@/lib/types/proyecto/proyecto.entity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ConfiguracionControlesTableRowFormData } from "../types/configuracionControlesTableRowFormData";
import { deleteControl, editControl } from "@/lib/actions/control/control.actions";
import { useMemo } from "react";
import { getNombreById } from "@/lib/utils/getNombreById";
import { Box, TableRow } from "@mui/material";
import { TableRowCell } from "../../common/tables/tableRowCell";
import { TableActionButton } from "../../common/components/tableActionButton";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import { ControlledTextField } from "../../common/inputs/controlledTextField";
import { ControlledSelect } from "../../common/inputs/controlledSelect";

export default function ConfiguracionControlesTableRow({
    control,
    proyectos
}: {
    control: ControlesItemDto,
    proyectos: Proyecto[]
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    const show = useShow();
    const { control: formControl, handleSubmit, setValue } = useForm<ConfiguracionControlesTableRowFormData>({
        defaultValues: {
            serie: '',
            id_proyecto: ''
        }
    });
    //mutations
    const edit = useMutation({
        mutationFn: (data: {
            id: number,
            serie: string,
            id_proyecto: number | ''
        }) => editControl(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getControles']
            });
            showSuccess('Control editado correctemente');
            show.handleShow();
        },
        onError: () => showError('Error al editar el control')
    });
    const remove = useMutation({
        mutationFn: (data: {
            id: number
        }) => deleteControl(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getControles']
            });
            showSuccess('Control dado de baja correctamente');
        },
        onError: () => showError('Error al dar de baja control')
    });
    //memo
    const getNombreProyecto = useMemo(() => getNombreById(proyectos), [proyectos]);
    return (
        <TableRow>
            <TableRowCell alignment='left'>
                {show.show ? (
                    <ControlledTextField
                        control={formControl}
                        name='serie'
                        disabled={edit.isPending || remove.isPending}
                        label='Número de Serie'
                    />
                ) : (
                    control.serie
                )}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {show.show ? (
                    <ControlledSelect
                        control={formControl}
                        name='id_proyecto'
                        label='Proyecto'
                        disabled={proyectos.length === 0 || !proyectos || edit.isPending || remove.isPending}
                        items={proyectos}
                    />
                ) : (
                    getNombreProyecto(control.id_proyecto)
                )}
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
                                disabled={edit.isPending}
                                onClick={handleSubmit((data) => {
                                    edit.mutate({
                                        id: control.id,
                                        serie: data.serie,
                                        id_proyecto: data.id_proyecto,
                                    });
                                })}
                                position='first'
                            />
                            <TableActionButton
                                tooltip='Cancelar'
                                icon={<CloseRoundedIcon />}
                                color='error'
                                loading={edit.isPending}
                                disabled={edit.isPending}
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
                                disabled={edit.isPending}
                                onClick={() => {
                                    show.handleShow();
                                    setValue('id_proyecto', control.id_proyecto ?? ''),
                                        setValue('serie', control.serie ?? '');
                                }}
                                position={'first'}
                            />
                            <TableActionButton
                                tooltip='¿Dar Baja?'
                                confirmTooltip='Confirmar'
                                icon={<DeleteRoundedIcon />}
                                color='error'
                                loading={remove.isPending}
                                disabled={edit.isPending}
                                onClick={() => remove.mutate({ id: control.id })}
                                position={'last'}
                            />
                        </>
                    }
                </Box>
            </TableRowCell>
        </TableRow >
    )
}