import { getTiposAusenciaPaginated } from "@/lib/actions/tiposAusencia/tipoAusencia.actions";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { usePagination } from "@/lib/hooks/usePagination";
import { useShow } from "@/lib/hooks/useShow";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import TableWrapper from "../../common/wrappers/tableWrapper";
import { Button, TableBody } from "@mui/material";
import { TableSkeleton } from "../../common/tables/tableSkeleton";
import { TableHeader } from "../../common/tables/tableHeader";
import { TableBase } from "../../common/tables/tableBase";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { TipoAusenciaItemDto } from "@/lib/types/tipoAusencia/get-tipoausencia-paginated";
import ConfiguracionTiposAusenciaTableRow from "./configuracionTiposAusenciaTableRow";
import ConfiguracionTiposAusenciaForm from "./configuracionTiposAusenciaForm";

export default function ConfiguraciónTiposAusenciaTab() {
    //hooks
    const { showWarning } = useSnackbar();
    const pagination = usePagination({ limit: 25 });
    const show = useShow();
    //query
    const tiposAusencia = useQuery({
        queryKey: [
            'getTiposAusenciaPaginated',
            pagination.limit,
            pagination.page
        ],
        queryFn: () => getTiposAusenciaPaginated({
            page: pagination.page,
            limit: pagination.limit
        })
    });
    //feedback
    useEffect(() => {
        if (tiposAusencia.isError) showWarning('Error al cargar tipos de ausencia');
    }, [tiposAusencia.isError, showWarning])
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            {show.show ? (
                <ConfiguracionTiposAusenciaForm
                    handleShow={show.handleShow}
                />
            ) : (
                <>
                    {/** Botón */}
                    <Button
                        variant='contained'
                        color='success'
                        size='small'
                        className='!h-10'
                        disableElevation
                        onClick={show.handleShow}
                        startIcon={<AddRoundedIcon />}
                    >
                        Crear Tipo de Ausencia
                    </Button>
                    {/** Tabla */}
                    <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                        <TableWrapper
                            isLoading={tiposAusencia.isLoading}
                            page={pagination.page}
                            limit={pagination.limit}
                            handlePageChange={pagination.handlePageChange}
                            handleLimitChange={pagination.handleLimitChange}
                            total={tiposAusencia.data?.totalTiposAusencia ?? 0}
                        >
                            <TableBase
                                items={tiposAusencia.data?.tiposAusencia ?? []}
                                isLoading={tiposAusencia.isLoading}
                                header={
                                    <TableHeader
                                        titles={[
                                            { title: 'Nombre', width: '33%', alignment: 'left' },
                                            { title: 'Estado', width: '33%', alignment: 'center' },
                                            { title: 'Acciones', width: '33%', alignment: 'right' }
                                        ]}
                                    />
                                }
                                skeleton={
                                    <TableSkeleton
                                        rows={10}
                                        columns={[
                                            { variant: 'text', alignment: 'left', colWidth: '17%', width: 150 },
                                            { variant: 'text', alignment: 'center', colWidth: '17%', width: 150 },
                                            { variant: 'rectangular', alignment: 'right', colWidth: '17%', width: 75 },
                                        ]}
                                    />
                                }
                                body={
                                    <TableBody>
                                        {(tiposAusencia.data?.tiposAusencia ?? [])
                                            .map((tipoAusencia: TipoAusenciaItemDto) => (
                                                <ConfiguracionTiposAusenciaTableRow
                                                    key={tipoAusencia.id}
                                                    tipoAusencia={tipoAusencia}
                                                />
                                            ))}
                                    </TableBody>
                                }
                                noItemMessage='No se encontraron tipos de ausencia'
                                containerClassName='outer-table-container flex-1 overflow-auto'
                            />
                        </TableWrapper>
                    </div>
                </>
            )}
        </div>
    );
};