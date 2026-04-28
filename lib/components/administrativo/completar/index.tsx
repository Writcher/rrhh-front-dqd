'use client'

import { useSnackbar } from "@/lib/contexts/snackbar"
import { usePagination } from "@/lib/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTiposAusencia } from "@/lib/actions/tiposAusencia/tipoAusencia.actions";
import { useEffect } from "react";
import { getJornadasByImportacion } from "@/lib/actions/jornada/jornada.actions";
import { SetImportacionCompletaParams } from "./types/setImportacionCompletaParams";
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import SyncIcon from '@mui/icons-material/Sync';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useRouter } from "next/navigation";
import { setImportacionCompleta } from "@/lib/actions/importacion/importacion.actions";
import TableWrapper from "../../common/wrappers/tableWrapper";
import { Button, TableBody } from "@mui/material";
import { TableSkeleton } from "../../common/tables/tableSkeleton";
import { TableHeader } from "../../common/tables/tableHeader";
import { TableBase } from "../../common/tables/tableBase";
import { JornadasImportacionItemDto } from "@/lib/types/jornada/get-jornada-importacion";
import CompletarTableRow from "./components/CompletarTableRow";

export default function Completar({
    id_importacion
}: {
    id_importacion: number
}) {
    //init
    const router = useRouter();
    const queryClient = useQueryClient();
    //hooks
    const { showSuccess, showError, showWarning } = useSnackbar();
    const pagination = usePagination({ limit: 25 });
    //query
    const tiposAusencia = useQuery({
        queryKey: ['getTiposAusencia'],
        queryFn: () => getTiposAusencia(),
        refetchOnWindowFocus: false
    });
    const jornadas = useQuery({
        queryKey: [
            'getJornadasPorImportacion',
            pagination.page,
            pagination.limit
        ],
        queryFn: () => getJornadasByImportacion({
            id_importacion: id_importacion,
            page: pagination.page,
            limit: pagination.limit
        }),
        refetchOnWindowFocus: false
    });
    //mutation
    const complete = useMutation({
        mutationFn: (data: SetImportacionCompletaParams) => setImportacionCompleta(data),
        onSuccess: () => {
            showSuccess('Importación marcada como completa');
            queryClient.invalidateQueries({
                queryKey: ['getImportaciones']
            });
            router.back();
        },
        onError: () => showError('Error al marcar importación como completa')
    });
    //const
    const disabled = jornadas.isLoading || Number(jornadas.data?.totalJornadas ?? 0) !== 0;
    //feedback
    useEffect(() => {
        if (tiposAusencia.isError) showWarning('Error al cargar tipos de ausencia');
        if (jornadas.isError) showWarning('Error al cargar jornadas');
    }, [tiposAusencia.isError, jornadas.isError, showWarning]);
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                <TableWrapper
                    isLoading={jornadas.isLoading}
                    page={pagination.page}
                    limit={pagination.limit}
                    handlePageChange={pagination.handlePageChange}
                    handleLimitChange={pagination.handleLimitChange}
                    total={jornadas.data?.totalJornadas ?? 0}
                >
                    <TableBase
                        items={jornadas.data?.jornadas ?? []}
                        isLoading={jornadas.isLoading}
                        header={
                            <TableHeader
                                titles={[
                                    { title: 'Tipo', width: '10%', alignment: 'left'},
                                    { title: 'Nombre de Empleado', width: '35%', alignment: 'center' },
                                    { title: 'Entrada y Salida / Tipo de Ausencia', width: '30%', alignment: 'center', span: 2 },
                                    { title: 'Acciones', width: '25%', alignment: 'right' }
                                ]}
                            />
                        }
                        skeleton={
                            <TableSkeleton
                                rows={10}
                                columns={[
                                    { variant: 'text', alignment: 'left', colWidth: '10%', width: 100 },
                                    { variant: 'text', alignment: 'center', colWidth: '35%', width: 200 },
                                    { variant: 'rectangular', alignment: 'center', colWidth: '30%', width: 400, span: 2 },
                                    { variant: 'rectangular', alignment: 'right', colWidth: '25%', width: 300 }
                                ]}
                            />
                        }
                        body={
                            <TableBody>
                                {(jornadas.data?.jornadas ?? [])
                                    .map((jornada: JornadasImportacionItemDto) => (
                                        <CompletarTableRow
                                            key={jornada.id}
                                            jornada={jornada}
                                            tiposAusencia={tiposAusencia.data ?? []}
                                        />
                                    ))}
                            </TableBody>
                        }
                        noItemMessage='No se encontraron empleados'
                        containerClassName='outer-table-container flex-1 overflow-auto'
                    />
                </TableWrapper>
            </div>
            <div className='flex w-full justify-between'>
                <Button
                    variant='contained'
                    color='warning'
                    onClick={() => router.back()}
                    disableElevation
                    startIcon={<ArrowBackRoundedIcon />}
                >
                    Volver
                </Button>
                <Button
                    variant='contained'
                    color='success'
                    disableElevation
                    onClick={() => complete.mutate({ id: id_importacion })}
                    endIcon={
                        complete.isPending
                            ? <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                            : <SaveAsRoundedIcon />
                    }
                    disabled={complete.isPending || jornadas.isLoading || disabled}
                >
                    {complete.isPending ? 'Confirmando' : 'Confirmar'}
                </Button>
            </div>
        </div>
    )
}