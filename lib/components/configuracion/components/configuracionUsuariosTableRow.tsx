import { useSnackbar } from "@/lib/contexts/snackbar";
import { useShow } from "@/lib/hooks/useShow";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { UsuarioItemDto } from "@/lib/types/usuario/get-usuario";
import { Box, Chip, TableRow } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfiguracionUsuariosTableRowFormData } from "../types/configuracionUsuariosTableRowFormData";
import { useForm } from "react-hook-form";
import { deleteUsuario, editUsuario, editUsuarioPassword } from "@/lib/actions/usuario/usuario.actions";
import { TableRowCell } from "../../common/tables/tableRowCell";
import { ControlledTextField } from "../../common/inputs/controlledTextField";
import { ControlledSelect } from "../../common/inputs/controlledSelect";
import { TipoUsuario } from "@/lib/types/tipoUsuario/tipoUsuario.entity";
import { Proyecto } from "@/lib/types/proyecto/proyecto.entity";
import { useMemo } from "react";
import { getNombreById } from "@/lib/utils/getNombreById";
import { TableActionButton } from "../../common/components/tableActionButton";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';

export default function ConfiguracionUsuariosTableRow({
    usuario,
    tiposUsuario,
    proyectos
}: {
    usuario: UsuarioItemDto,
    tiposUsuario: TipoUsuario[],
    proyectos: Proyecto[]
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    const { isRRHH } = useUserRole();
    const showPassword = useShow();
    const showEdit = useShow();
    const { control, handleSubmit, setValue } = useForm<ConfiguracionUsuariosTableRowFormData>({
        defaultValues: {
            id_proyecto: usuario.id_proyecto ?? '',
            id_tipousuario: usuario.id_tipousuario ?? '',
            nombre: usuario.nombre ?? '',
            email: usuario.email ?? '',
            contraseña: ''
        }
    });
    //mutations
    const edit = useMutation({
        mutationFn: (data: {
            id: number,
            id_proyecto: number | '',
            id_tipousuario: number | '',
            nombre: string,
            email: string
        }) => editUsuario(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getUsuarios']
            });
            showSuccess('Usuario editado correctemente');
            showEdit.handleShow();
        },
        onError: () => showError('Error al editar el usuario')
    });
    const editPassword = useMutation({
        mutationFn: (data: {
            id: number,
            contraseña: string
        }) => editUsuarioPassword(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getUsuarios']
            });
            showSuccess('Contraseña modificada correctamente');
            showPassword.handleShow();
        },
        onError: () => showError('Error al modificar contraseña')
    });
    const remove = useMutation({
        mutationFn: (data: {
            id: number
        }) => deleteUsuario(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getUsuarios']
            });
            showSuccess('Usuario dado de baja correctamente');
        },
        onError: () => showError('Error al dar de baja usuario')
    });
    //memo
    const getNombreProyecto = useMemo(() => getNombreById(proyectos), [proyectos]);
    return (
        <TableRow>
            <TableRowCell alignment='left'>
                {showEdit.show ? (
                    <ControlledTextField
                        control={control}
                        name='nombre'
                        disabled={edit.isPending || editPassword.isPending || remove.isPending}
                        label='Nombre'
                    />
                ) : (
                    usuario.nombre
                )}
            </TableRowCell>
            {showPassword.show ? (
                <TableRowCell alignment='center' span={4}>
                    <ControlledTextField
                        control={control}
                        name='contraseña'
                        disabled={edit.isPending || editPassword.isPending || remove.isPending}
                        label='Nueva Contraseña'
                    />
                </TableRowCell>
            ) : (
                <>
                    <TableRowCell alignment='center'>
                        {showEdit.show ? (
                            <ControlledTextField
                                control={control}
                                name='email'
                                disabled={edit.isPending || editPassword.isPending || remove.isPending}
                                label='Email'
                            />
                        ) : (
                            usuario.email
                        )}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        {showEdit.show ? (
                            <ControlledSelect
                                control={control}
                                name='id_proyecto'
                                label='Proyecto'
                                disabled={proyectos.length === 0 || !proyectos || edit.isPending || editPassword.isPending || remove.isPending || isRRHH}
                                items={proyectos}
                            />
                        ) : (
                            getNombreProyecto(usuario.id_proyecto)
                        )}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        {showEdit.show ? (
                            <ControlledSelect
                                control={control}
                                name='id_tipousuario'
                                label='Tipo de Usuario'
                                disabled={tiposUsuario.length === 0 || !tiposUsuario || edit.isPending || editPassword.isPending || remove.isPending}
                                items={tiposUsuario}
                            />
                        ) : (
                            usuario.tipousuario
                        )}
                    </TableRowCell>
                    <TableRowCell alignment='center'>
                        <Chip
                            label={usuario.estadousuario}
                            className='!rounded'
                            color={
                                usuario.estadousuario.toLowerCase() === 'activo' ? 'success' : 'error'
                            }
                        />
                    </TableRowCell>
                </>
            )}
            <TableRowCell alignment='right' variant='buttons'>
                <Box sx={{ display: 'flex' }}>
                    {(showPassword.show || showEdit.show) &&
                        <>
                            <TableActionButton
                                tooltip='Guardar'
                                icon={<SaveAsRoundedIcon />}
                                color='success'
                                loading={edit.isPending || editPassword.isPending}
                                disabled={edit.isPending || editPassword.isPending || usuario.estadousuario === 'Baja'}
                                onClick={handleSubmit((data) => {
                                    if (showEdit.show) edit.mutate({
                                        id: usuario.id,
                                        nombre: data.nombre,
                                        email: data.email,
                                        id_proyecto: data.id_proyecto,
                                        id_tipousuario: data.id_tipousuario
                                    });
                                    if (showPassword.show) editPassword.mutate({
                                        id: usuario.id,
                                        contraseña: data.contraseña
                                    });
                                })}
                                position='first'
                            />
                            <TableActionButton
                                tooltip='Cancelar'
                                icon={<CloseRoundedIcon />}
                                color='error'
                                loading={edit.isPending || editPassword.isPending}
                                disabled={edit.isPending || editPassword.isPending || usuario.estadousuario === 'Baja'}
                                onClick={() => {
                                    if (showEdit.show) showEdit.handleShow();
                                    if (showPassword.show) showPassword.handleShow();
                                }}
                                position='last'
                            />
                        </>
                    }
                    {(!showEdit.show && !showPassword.show) &&
                        <>
                            <TableActionButton
                                tooltip='Editar'
                                icon={<EditRoundedIcon />}
                                color='info'
                                loading={edit.isPending}
                                disabled={edit.isPending || editPassword.isPending || usuario.estadousuario === 'Baja'}
                                onClick={() => {
                                    showEdit.handleShow();
                                    setValue('id_proyecto', usuario.id_proyecto ?? ''),
                                        setValue('id_tipousuario', usuario.id_tipousuario ?? ''),
                                        setValue('nombre', usuario.nombre ?? '');
                                    setValue('email', usuario.email ?? '');
                                }}
                                position={'first'}
                            />
                            <TableActionButton
                                tooltip='Editar Contraseña'
                                icon={<LockResetRoundedIcon />}
                                color='warning'
                                loading={edit.isPending}
                                disabled={edit.isPending || editPassword.isPending || usuario.estadousuario === 'Baja'}
                                onClick={() => {
                                    showPassword.handleShow();
                                }}
                                position={'middle'}
                            />
                            <TableActionButton
                                tooltip='¿Dar Baja?'
                                confirmTooltip='Confirmar'
                                icon={<PersonRemoveRoundedIcon />}
                                color='error'
                                loading={remove.isPending}
                                disabled={edit.isPending || editPassword.isPending || usuario.estadousuario === 'Baja'}
                                onClick={() => remove.mutate({ id: usuario.id })}
                                position={'last'}
                            />
                        </>
                    }
                </Box>
            </TableRowCell>
        </TableRow >
    )
};