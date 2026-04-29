import { useQuery } from "@tanstack/react-query";
import { TableBody } from "@mui/material";
import { usePagination } from "@/lib/hooks/usePagination";
import { getJornadas } from "@/lib/actions/jornada/jornada.actions";
import { JornadaItemDto } from "@/lib/types/jornada/get-jornada";
import TableWrapper from "../../common/wrappers/tableWrapper";
import { TableBase } from "../../common/tables/tableBase";
import { TableHeader } from "../../common/tables/tableHeader";
import { TableSkeleton } from "../../common/tables/tableSkeleton";
import EmpleadosJornadasInnerTableJornadaRow from "./empleadosJornadasInnerTableJornadaRow";

export default function EmpleadosJornadasInnerTableJornadasTab({
    id,
    idMes,
    quincena
}: {
    id: number,
    idMes: number | '',
    quincena: number | ''
}) {
    //hooks
    const pagination = usePagination({ limit: 25, resetKey: `${idMes}-${quincena}` });
    //query
    const jornadas = useQuery({
        queryKey: [
            'getJornadasEmpleado',
            pagination.page,
            pagination.limit,
            id,
            idMes,
            quincena
        ],
        queryFn: () => getJornadas({
            page: pagination.page,
            limit: pagination.limit,
            id_empleado: id,
            id_mes: idMes,
            quincena: quincena
        }),
        refetchOnWindowFocus: false
    });
    return (
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
                            { title: 'Fecha', width: '10%', alignment: 'left' },
                            { title: 'Entrada', width: '7.5%', alignment: 'center' },
                            { title: 'Redondeo', width: '7.5%', alignment: 'center' },
                            { title: 'Salida', width: '7.5%', alignment: 'center' },
                            { title: 'Redondeo', width: '7.5%', alignment: 'center' },
                            { title: 'Horas', width: '10%', alignment: 'center' },
                            { title: 'Tipo de Jornada', width: '15%', alignment: 'center' },
                            { title: 'Tipo de Ausencia', width: '15%', alignment: 'center' },
                            { title: 'Acciones', width: '20%', alignment: 'right' }
                        ]}
                    />
                }
                skeleton={
                    <TableSkeleton
                        rows={10}
                        columns={[
                            { variant: 'text', colWidth: '10%', alignment: 'left', width: 100 },
                            { variant: 'text', colWidth: '10%', alignment: 'center', width: 75 },
                            { variant: 'text', colWidth: '10%', alignment: 'center', width: 75 },
                            { variant: 'text', colWidth: '10%', alignment: 'center', width: 75 },
                            { variant: 'text', colWidth: '10%', alignment: 'center', width: 75 },
                            { variant: 'text', colWidth: '10%', alignment: 'center', width: 75 },
                            { variant: 'text', colWidth: '10%', alignment: 'center', width: 100 },
                            { variant: 'text', colWidth: '15%', alignment: 'center', width: 100 },
                            { variant: 'rectangular', colWidth: '15%', alignment: 'right', width: 200 }
                        ]}
                    />
                }
                body={
                    <TableBody>
                        {(jornadas.data?.jornadas ?? [])
                            .map((jornada: JornadaItemDto) => (
                                <EmpleadosJornadasInnerTableJornadaRow
                                    key={jornada.id}
                                    jornada={jornada}
                                />
                            ))}
                    </TableBody>
                }
                noItemMessage='No se encontraron jornadas'
                containerClassName='inner-table-container'
            />
        </TableWrapper>
    );
};
