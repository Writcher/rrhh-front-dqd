import { useQuery } from "@tanstack/react-query";
import { TableBody } from "@mui/material";
import { getResumen } from "@/lib/actions/jornada/jornada.actions";
import TableWrapper from "../../common/wrappers/tableWrapper";
import { TableBase } from "../../common/tables/tableBase";
import { TableHeader } from "../../common/tables/tableHeader";
import { TableSkeleton } from "../../common/tables/tableSkeleton";
import EmpleadosJornadasInnerTableResumenRow from "./empleadosJornadasInnerTableResumenRow";
import { usePagination } from "@/lib/hooks/usePagination";
import { getObservacionesByEmpleado } from "@/lib/actions/observacion/observacion.actions";
import { ObservacionItemDto } from "@/lib/types/observacion/get-observacion-empleado";
import EmpleadosJornadasInnerTableObservacionesRow from "./empleadosJornadasInnerTableObservacionesRow";

export default function EmpleadosJornadasInnerTableResumenTab({
    id,
    isMensual,
    idMes,
    quincena
}: {
    id: number,
    isMensual: boolean,
    idMes: number | '',
    quincena: number | ''
}) {
    //hooks
    const pagination = usePagination({ limit: 25, resetKey: `${idMes}-${quincena}` });
    //query
    const resumen = useQuery({
        queryKey: [
            'getResumenEmpleado',
            id,
            idMes,
            quincena
        ],
        queryFn: () => getResumen({
            id_empleado: id,
            id_mes: idMes,
            quincena: quincena
        }),
        refetchOnWindowFocus: false
    });
    const observaciones = useQuery({
        queryKey: [
            'getObservacionesEmpleado',
            id,
            idMes,
            quincena,
            pagination.page,
            pagination.limit
        ],
        queryFn: () => getObservacionesByEmpleado({
            id_empleado: id,
            id_mes: idMes,
            quincena: quincena,
            page: pagination.page,
            limit: pagination.limit
        }),
        refetchOnWindowFocus: false
    });
    //observaciones
    return (
        <div className='flex flex-col gap-2 flex-1 min-h-0 overflow-hidden'>
            <TableWrapper
                isLoading={resumen.isLoading}
                paginated={false}
            >
                <TableBase
                    items={resumen.data?.resumen ? [resumen.data.resumen] : []}
                    isLoading={resumen.isLoading}
                    header={
                        <TableHeader
                            titles={isMensual
                                ? [
                                    { title: 'Total', width: '15%', alignment: 'center' },
                                    { title: 'Total Normal', width: '15%', alignment: 'center' },
                                    { title: 'Total 50%', width: '15%', alignment: 'center' },
                                    { title: 'Total 100%', width: '15%', alignment: 'center' },
                                    { title: 'Total Feriado', width: '15%', alignment: 'center' },
                                    { title: 'Total Nocturno', width: '15%', alignment: 'center' }
                                ]
                                : [
                                    { title: 'Total Asistencias', width: '33%', alignment: 'center' },
                                    { title: 'Total Ausencias Justificadas', width: '33%', alignment: 'center' },
                                    { title: 'Total Ausencias Injustificadas', width: '33%', alignment: 'center' }
                                ]}
                        />
                    }
                    skeleton={
                        <TableSkeleton
                            rows={1}
                            columns={isMensual
                                ? [
                                    { variant: 'text', colWidth: '15%', alignment: 'center', width: 75 },
                                    { variant: 'text', colWidth: '15%', alignment: 'center', width: 75 },
                                    { variant: 'text', colWidth: '15%', alignment: 'center', width: 75 },
                                    { variant: 'text', colWidth: '15%', alignment: 'center', width: 75 },
                                    { variant: 'text', colWidth: '15%', alignment: 'center', width: 75 },
                                    { variant: 'text', colWidth: '15%', alignment: 'center', width: 75 }
                                ]
                                : [
                                    { variant: 'text', colWidth: '33%', alignment: 'center', width: 75 },
                                    { variant: 'text', colWidth: '33%', alignment: 'center', width: 75 },
                                    { variant: 'text', colWidth: '33%', alignment: 'center', width: 75 }
                                ]}
                        />
                    }
                    body={
                        <TableBody>
                            <EmpleadosJornadasInnerTableResumenRow
                                resumen={resumen.data?.resumen!}
                                isMensual={isMensual}
                            />
                        </TableBody>
                    }
                    noItemMessage='No se encontraron horas'
                    containerClassName='inner-table-container'
                />
            </TableWrapper>
            <TableWrapper
                isLoading={observaciones.isLoading}
                page={pagination.page}
                limit={pagination.limit}
                handlePageChange={pagination.handlePageChange}
                handleLimitChange={pagination.handleLimitChange}
                total={observaciones.data?.totalObservaciones ?? 0}
            >
                <TableBase
                    items={observaciones.data?.observaciones ?? []}
                    isLoading={observaciones.isLoading}
                    header={
                        <TableHeader
                            titles={[
                                { title: 'Fecha', width: '10%', alignment: 'left' },
                                { title: 'Observación', width: '90%', alignment: 'center' }
                            ]}
                        />
                    }
                    skeleton={
                        <TableSkeleton
                            rows={10}
                            columns={[
                                { variant: 'text', colWidth: '10%', alignment: 'left', width: 100 },
                                { variant: 'text', colWidth: '90%', alignment: 'center', width: 300 }
                            ]}
                        />
                    }
                    body={
                        <TableBody>
                            {(observaciones.data?.observaciones ?? [])
                                .map((observacion: ObservacionItemDto) => (
                                    <EmpleadosJornadasInnerTableObservacionesRow
                                        key={observacion.id}
                                        observacion={observacion}
                                    />
                                ))}
                        </TableBody>
                    }
                    noItemMessage='No se encontraron observaciones'
                    containerClassName='inner-table-container'
                />
            </TableWrapper>
        </div>
    );
};
