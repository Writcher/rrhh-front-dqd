import { EmpleadoItemDto } from "@/lib/types/empleado/get-empleado";
import { useForm } from "react-hook-form";
import { EmpleadosTableEditFormData } from "../types/empleadosTableEditFormData";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShow } from "@/lib/hooks/useShow";
import { ModalidadValidacion } from "@/lib/types/modalidadValidacion/modalidadValidacion.entity";
import { deactivateEmpleado, editEmpleado } from "@/lib/actions/empleado/empleado.actions";
import { Box, Chip, TableRow } from "@mui/material";
import { TableRowCell } from "@/lib/components/common/tables/tableRowCell";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import { useEffect } from "react";
import { ControlledSelect } from "../../common/inputs/controlledSelect";
import { TableActionButton } from "@/lib/components/common/components/tableActionButton";

export default function EmpleadosTableRow({
    empleado,
    modalidadesValidacion
}: {
    empleado: EmpleadoItemDto,
    modalidadesValidacion: ModalidadValidacion[]
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    const { control, setValue, handleSubmit, reset, formState: { isValid } } = useForm<EmpleadosTableEditFormData>({
        defaultValues: {
            id_modalidadvalidacion: ''
        }
    });
    const show = useShow();
    //mutacion
    const edit = useMutation({
        mutationFn: (data: { id_mdoalidadvalidacion: number, id: number }) => editEmpleado(data),
        onSuccess: () => {
            showSuccess('Empleado editado correctamente');
            show.handleShow();
            queryClient.invalidateQueries({
                queryKey: ['getEmpleados']
            });
        },
        onError: () => showError('Error al editar empleado')
    });
    const deactivate = useMutation({
        mutationFn: (data: { id: number }) => deactivateEmpleado(data),
        onSuccess: () => {
            showSuccess('Empleado dado de baja correctamente');
            queryClient.invalidateQueries({
                queryKey: ['getEmpleados']
            });
        },
        onError: () => showError('Error al dar de baja empleado')
    });
    //effect
    useEffect(() => {
        if (empleado) {
            setValue('id_modalidadvalidacion', empleado.id_modalidadvalidacion ? empleado.id_modalidadvalidacion : '');
        };
    }, [empleado, setValue, show.show])
    return (
        <TableRow>
            <TableRowCell alignment='left'>
                {empleado.legajo}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {empleado.dni}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {empleado.nombre}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {empleado.tipoempleado}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {show.show ? (
                    <ControlledSelect
                        control={control}
                        name='id_modalidadvalidacion'
                        disabled={!modalidadesValidacion || modalidadesValidacion.length === 0}
                        items={modalidadesValidacion}
                    />
                ) : (
                    empleado.modalidadvalidacion
                )}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {empleado.nombreproyecto}
            </TableRowCell>
            <TableRowCell alignment='center'>
                <Chip
                    label={empleado.estadoempleado}
                    className='!rounded'
                    color={
                        empleado.estadoempleado.toLowerCase() === 'activo' ? 'success' : 'error'
                    }
                />
            </TableRowCell>
            <TableRowCell alignment='right' variant='buttons'>
                <Box sx={{ display: 'flex' }}>
                    {show.show ? (
                        <>
                            <TableActionButton
                                tooltip='Guardar'
                                icon={<SaveAsRoundedIcon />}
                                color='success'
                                loading={edit.isPending}
                                disabled={edit.isPending || !isValid}
                                onClick={handleSubmit((data) => edit.mutate({ id_mdoalidadvalidacion: Number(data.id_modalidadvalidacion), id: empleado.id }))}
                                position='first'
                            />
                            <TableActionButton
                                tooltip='Cancelar'
                                icon={<CloseRoundedIcon />}
                                color='error'
                                loading={edit.isPending}
                                disabled={edit.isPending}
                                onClick={() => show.handleShow()}
                                position='last'
                            />
                        </>
                    ) : (
                        <>
                            <TableActionButton
                                tooltip='Editar'
                                icon={<EditRoundedIcon />}
                                color='success'
                                loading={deactivate.isPending}
                                disabled={deactivate.isPending || empleado.estadoempleado.toLowerCase() === 'baja'}
                                onClick={() => {
                                    show.handleShow();
                                    reset();
                                }}
                                position='first'
                            />
                            <TableActionButton
                                tooltip='¿Dar Baja?'
                                confirmTooltip='Confirmar'
                                icon={<PersonRemoveRoundedIcon />}
                                color='error'
                                loading={deactivate.isPending}
                                disabled={deactivate.isPending || empleado.estadoempleado.toLowerCase() === 'baja' || show.show}
                                onClick={() => deactivate.mutate({ id: empleado.id })}
                                position='last'
                            />
                        </>
                    )}
                </Box>
            </TableRowCell>
        </TableRow>
    );
};