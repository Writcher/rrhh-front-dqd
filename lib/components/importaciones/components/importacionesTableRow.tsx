import { deleteImportacion } from "@/lib/actions/importacion/importacion.actions";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { ImportacionItemDto } from "@/lib/types/importacion/get-importacion";
import { Box, Button, Chip, TableRow } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TableRowCell } from "../../common/tables/tableRowCell";
import LightTooltip from "../../common/components/tooltip";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import Link from "next/link";
import { TableActionButton } from "@/lib/components/common/components/tableActionButton";

export default function ImportacionesTableRow({
    importacion,
    isAdministrativo
}: {
    importacion: ImportacionItemDto,
    isAdministrativo: boolean
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError } = useSnackbar();
    //mutacion
    const remove = useMutation({
        mutationFn: (data: { id: number }) => deleteImportacion(data),
        onSuccess: () => {
            showSuccess('Importacion eliminada correctamente');
            queryClient.invalidateQueries({
                queryKey: ['getImportaciones']
            });
        },
        onError: () => showError('Error al eliminar importacion')
    });
    return (
        <TableRow>
            <TableRowCell alignment='left'>
                {importacion.nombre}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {importacion.nombreproyecto}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {importacion.nombreusuario}
            </TableRowCell>
            <TableRowCell alignment={`${isAdministrativo ? 'center' : 'right'}`}>
                <Chip
                    label={importacion.nombreestado}
                    className='!rounded'
                    color={
                        importacion.nombreestado.toLowerCase() === 'completa' ? 'success' : 'error'
                    }
                />
            </TableRowCell>
            {isAdministrativo &&
                <TableRowCell alignment='right' variant='buttons'>
                    <Box sx={{ display: 'flex' }}>
                        <LightTooltip title='Revisar' placement='left' arrow>
                            <Button
                                component={Link}
                                href={`/administrativo/importacion/${importacion.id}/completar`}
                                variant='contained'
                                color='success'
                                disableElevation
                                size='small'
                                disabled={remove.isPending || importacion.nombreestado.toLowerCase() === 'completa'}
                                sx={{ borderRadius: '4px 0 0 4px' }}
                            >
                                <EditNoteRoundedIcon />
                            </Button>
                        </LightTooltip>
                        <TableActionButton
                            tooltip='¿Borrar?'
                            confirmTooltip='Confirmar'
                            icon={<DeleteForeverRoundedIcon />}
                            color='error'
                            loading={remove.isPending}
                            disabled={remove.isPending}
                            onClick={() => remove.mutate({ id: importacion.id })}
                            position='last'
                        />
                    </Box>
                </TableRowCell>
            }
        </TableRow>
    )
};