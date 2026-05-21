import { ModalidadImportacion } from "@/lib/types/modalidadImportacion/modalidadImportacion.entity";
import { ModalidadTrabajo } from "@/lib/types/modalidadTrabajo/modalidadTrabajo.entity";
import { ProyectoItemDto } from "@/lib/types/proyecto/get-proyecto-paginated";
import { TableActionButton } from "../../common/components/tableActionButton";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import { ConfiguracionProyectosTableRowFormData } from "../types/configuracionProyectosTableRowFormData";
import { useForm } from "react-hook-form";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShow } from "@/lib/hooks/useShow";
import { deactivateProyecto, editProyecto } from "@/lib/actions/proyecto/proyecto.actions";
import { Box, Chip, TableRow } from "@mui/material";
import { TableRowCell } from "../../common/tables/tableRowCell";
import { ControlledTextField } from "../../common/inputs/controlledTextField";
import { ControlledSelect } from "../../common/inputs/controlledSelect";

export default function ConfiguracionProyectosTableRow({
    proyecto,
    modalidadesImportacion,
    modalidadesTrabajo
}: {
    proyecto: ProyectoItemDto,
    modalidadesImportacion: ModalidadImportacion[],
    modalidadesTrabajo: ModalidadTrabajo[],
}) {
    //init 
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    const show = useShow();
    const { control, handleSubmit, setValue } = useForm<ConfiguracionProyectosTableRowFormData>({
        defaultValues: {
            nombre: '',
            nomina: '',
            id_modalidadimportacion: '',
            id_modalidadtrabajo: ''
        }
    });
    //mutations
    const edit = useMutation({
        mutationFn: (data: {
            id: number,
            nombre: string,
            nomina: string,
            id_modalidadimportacion: number,
            id_modalidadtrabajo: number
        }) => editProyecto({
            id: proyecto.id,
            nombre: data.nombre,
            nomina: data.nomina,
            id_modalidadimportacion: Number(data.id_modalidadimportacion),
            id_modalidadtrabajo: Number(data.id_modalidadtrabajo)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getProyectosPaginated']
            });
            showSuccess('Proyecto editado correctamente');
            show.handleShow();
        },
        onError: () => showError('Error al editar el proyecto')
    });
    const remove = useMutation({
        mutationFn: (data: {
            id: number
        }) => deactivateProyecto(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getProyectosPaginated']
            });
            showSuccess('Proyecto dado de baja correctamente');
        },
        onError: () => showError('Error al dar de baja proyecto')
    });
    return (
        <TableRow>
            <TableRowCell alignment='left' label='Nombre'>
                {show.show ? (
                    <ControlledTextField
                        control={control}
                        name='nombre'
                        disabled={edit.isPending || remove.isPending}
                        label='Nombre'
                    />
                ) : (
                    proyecto.nombre
                )}
            </TableRowCell>
            <TableRowCell alignment='center' label='Nómina'>
                {show.show ? (
                    <ControlledTextField
                        control={control}
                        name='nomina'
                        disabled={edit.isPending || remove.isPending}
                        label='Nombre en Nomina'
                    />
                ) : (
                    proyecto.nomina
                )}
            </TableRowCell>
            <TableRowCell alignment='center' label='Mod. Trabajo'>
                {show.show ? (
                    <ControlledSelect
                        control={control}
                        name='id_modalidadtrabajo'
                        label='Modalidad de Trabajo'
                        rules={{ required: 'Debe seleccionar una modalidad de trabajo' }}
                        disabled={edit.isPending || remove.isPending ||  modalidadesTrabajo.length === 0}
                        items={modalidadesTrabajo}
                    />
                ) : (
                    proyecto.modalidadtrabajo
                )}
            </TableRowCell>
            <TableRowCell alignment='center' label='Mod. Importación'>
                {show.show ? (
                    <ControlledSelect
                        control={control}
                        name='id_modalidadimportacion'
                        label='Modalidad de Importación'
                        rules={{ required: 'Debe seleccionar una modalidad de importación' }}
                        disabled={edit.isPending || remove.isPending ||  modalidadesImportacion.length === 0}
                        items={modalidadesImportacion}
                    />
                ) : (
                    proyecto.modalidadimportacion
                )}
            </TableRowCell>
            <TableRowCell alignment='center' label='Estado'>
                <Chip
                    label={proyecto.estadoparametro}
                    className='!rounded'
                    color={
                        proyecto.estadoparametro!.toLowerCase() === 'activo' ? 'success' : 'error'
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
                                disabled={edit.isPending || proyecto.estadoparametro === 'Baja'}
                                onClick={handleSubmit((data) => {
                                    edit.mutate({
                                        id: proyecto.id,
                                        nombre: data.nombre,
                                        nomina: data.nomina,
                                        id_modalidadimportacion: Number(data.id_modalidadimportacion),
                                        id_modalidadtrabajo: Number(data.id_modalidadtrabajo)
                                    });
                                })}
                                position='first'
                            />
                            <TableActionButton
                                tooltip='Cancelar'
                                icon={<CloseRoundedIcon />}
                                color='error'
                                loading={edit.isPending}
                                disabled={edit.isPending || proyecto.estadoparametro === 'Baja'}
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
                                disabled={edit.isPending || proyecto.estadoparametro === 'Baja'}
                                onClick={() => {
                                    show.handleShow();
                                    setValue('nombre', proyecto.nombre ?? '');
                                    setValue('nomina', proyecto.nomina ?? '');
                                    setValue('id_modalidadtrabajo', proyecto.id_modalidadtrabajo ?? '');
                                    setValue('id_modalidadimportacion', proyecto.id_modalidadimportacion ?? '');
                                }}
                                position={'first'}
                            />
                            <TableActionButton
                                tooltip='¿Dar Baja?'
                                confirmTooltip='Confirmar'
                                icon={<DeleteRoundedIcon />}
                                color='error'
                                loading={remove.isPending}
                                disabled={edit.isPending || proyecto.estadoparametro === 'Baja'}
                                onClick={() => remove.mutate({ id: proyecto.id })}
                                position={'last'}
                            />
                        </>
                    }
                </Box>
            </TableRowCell>
        </TableRow>
    );
}