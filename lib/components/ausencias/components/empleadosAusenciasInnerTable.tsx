import { getJornadas } from "@/lib/actions/jornada/jornada.actions";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { usePagination } from "@/lib/hooks/usePagination";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import TableWrapper from "../../common/wrappers/tableWrapper";
import { TableBase } from "../../common/tables/tableBase";
import { TableHeader } from "../../common/tables/tableHeader";
import { TableSkeleton } from "../../common/tables/tableSkeleton";
import { TableBody } from "@mui/material";
import { JornadaItemDto } from "@/lib/types/jornada/get-jornada";
import EmpleadosAusenciasInnerTableRow from "./empleadosAusenciasInnerTableRow";
import { TipoAusencia } from "@/lib/types/tipoAusencia/tipoAusencia.entity";

export default function EmpleadosAusenciasInnerTable({
    id,
    id_mes,
    quincena,
    id_tipoausencia,
    tiposAusencia
}: {
    id: number,
    id_mes: number | '',
    quincena: number | '',
    id_tipoausencia: number | '',
    tiposAusencia: TipoAusencia[]
}) {
    //hooks
    const { showWarning } = useSnackbar();
    const pagination = usePagination({
        limit: 25,
        resetKey: `${id}`
    });
    //query
    const ausencias = useQuery({
        queryKey: [
            'getAusenciasEmpleado',
            pagination.page,
            pagination.limit,
            id,
            id_mes,
            quincena,
            id_tipoausencia
        ],
        queryFn: () => getJornadas({
            page: pagination.page,
            limit: pagination.limit,
            id_empleado: id,
            id_mes: id_mes,
            quincena: quincena,
            id_tipoausencia: id_tipoausencia,
            ausencias: true
        }),
        refetchOnWindowFocus: false
    });
    //feedback
    useEffect(() => {
        if (ausencias.isError) showWarning('Error al cargar ausencias');
    }, [ausencias.isError, showWarning])
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden bg-white border-2 border-orange-500 rounded'>
            {/** Table */}
            <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                <TableWrapper
                    bordered={false}
                    isLoading={ausencias.isLoading}
                    page={pagination.page}
                    limit={pagination.limit}
                    handlePageChange={pagination.handlePageChange}
                    handleLimitChange={pagination.handleLimitChange}
                    total={ausencias.data?.totalJornadas ?? 0}
                >
                    <TableBase
                        items={ausencias.data?.jornadas ?? []}
                        isLoading={ausencias.isLoading}
                        header={
                            <TableHeader
                                titles={[
                                    { title: 'Fecha', width: '25%', alignment: 'left' },
                                    { title: 'Tipo de Ausencia', width: '25%', alignment: 'center' },
                                    { title: 'Observiaciones', width: '25%', alignment: 'center' },
                                    { title: 'Acciones', width: '25%', alignment: 'right' }
                                ]}
                            />
                        }
                        skeleton={
                            <TableSkeleton
                                rows={10}
                                columns={[
                                    { variant: 'text', alignment: 'left', colWidth: '25%', width: 100 },
                                    
                                ]}
                            />
                        }
                        body={
                            <TableBody>
                                {(ausencias.data?.jornadas ?? [])
                                    .map((ausencia: JornadaItemDto) => (
                                        <EmpleadosAusenciasInnerTableRow
                                            key={ausencia.id}
                                            ausencia={ausencia}
                                            tiposAusencia={tiposAusencia}
                                        />
                                    ))}
                            </TableBody>
                        }
                        noItemMessage='No se encontraron ausencias'
                        containerClassName='inner-table-container'
                    />
                </TableWrapper>
            </div>
        </div >
    );
};
