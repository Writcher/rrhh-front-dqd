import { getProyectosPaginated } from "@/lib/actions/proyecto/proyecto.actions";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { usePagination } from "@/lib/hooks/usePagination";
import { useShow } from "@/lib/hooks/useShow";
import { Button, TableBody } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TableWrapper from "../../common/wrappers/tableWrapper";
import { TableSkeleton } from "../../common/tables/tableSkeleton";
import { TableHeader } from "../../common/tables/tableHeader";
import { TableBase } from "../../common/tables/tableBase";
import { getModalidadesTrabajo } from "@/lib/actions/modalidadTrabajo/modalidadTrabajo.actions";
import { getModalidadesImportacion } from "@/lib/actions/modalidadImportacion/modalidadImportacion.actions";
import ConfiguracionProyectoForm from "./configuracionProyectosForm";
import { ProyectoItemDto } from "@/lib/types/proyecto/get-proyecto-paginated";
import ConfiguracionProyectosTableRow from "./configuracionProyectosTableRow";

export default function ConfiguraciónProyectosTab() {
    //hooks
    const { showWarning } = useSnackbar();
    const pagination = usePagination({ limit: 25 });
    const show = useShow();
    //query
    const proyectos = useQuery({
        queryKey: [
            'getProyectosPaginated',
            pagination.limit,
            pagination.page
        ],
        queryFn: () => getProyectosPaginated({
            page: pagination.page,
            limit: pagination.limit
        })
    });
    const modalidadesTrabajo = useQuery({
        queryKey: ['getModalidadesTrabajo'],
        queryFn: () => getModalidadesTrabajo(),
        refetchOnWindowFocus: false
    });
    const modalidadesImportacion = useQuery({
        queryKey: ['getModalidadesImportacion'],
        queryFn: () => getModalidadesImportacion(),
        refetchOnWindowFocus: false
    });
    //feedback
    useEffect(() => {
        if (proyectos.isError) showWarning('Error al cargar proyectos')
    }, [proyectos.isError, showWarning])
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            {show.show ? (
                <ConfiguracionProyectoForm
                    handleShow={show.handleShow}
                    modalidadesImportacion={modalidadesImportacion.data ?? []}
                    modalidadesTrabajo={modalidadesTrabajo.data ?? []}
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
                        Crear Proyecto
                    </Button>
                    {/** Tabla */}
                    <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                        <TableWrapper
                            isLoading={proyectos.isLoading}
                            page={pagination.page}
                            limit={pagination.limit}
                            handlePageChange={pagination.handlePageChange}
                            handleLimitChange={pagination.handleLimitChange}
                            total={proyectos.data?.totalProyectos ?? 0}
                        >
                            <TableBase
                                items={proyectos.data?.proyectos ?? []}
                                isLoading={proyectos.isLoading}
                                header={
                                    <TableHeader
                                        titles={[
                                            { title: 'Nombre', width: '20%', alignment: 'left' },
                                            { title: 'Nombre en Nomina', width: '20%', alignment: 'center' },
                                            { title: 'Modalidad de Trabajo', width: '15%', alignment: 'center' },
                                            { title: 'Modalidad de Importación', width: '15%', alignment: 'center' },
                                            { title: 'Estado', width: '10%', alignment: 'center' },
                                            { title: 'Acciones', width: '20%', alignment: 'right' }
                                        ]}
                                    />
                                }
                                skeleton={
                                    <TableSkeleton
                                        rows={10}
                                        columns={[
                                            { variant: 'text', alignment: 'left', colWidth: '20%', width: 150 },
                                            { variant: 'text', alignment: 'center', colWidth: '20%', width: 150 },
                                            { variant: 'text', alignment: 'center', colWidth: '15%', width: 150 },
                                            { variant: 'text', alignment: 'center', colWidth: '15%', width: 150 },
                                            { variant: 'rectangular', alignment: 'right', colWidth: '10%', width: 100 },
                                            { variant: 'rectangular', alignment: 'right', colWidth: '20%', width: 100 },
                                        ]}
                                    />
                                }
                                body={
                                    <TableBody>
                                        {(proyectos.data?.proyectos ?? [])
                                            .map((proyecto: ProyectoItemDto) => (
                                                <ConfiguracionProyectosTableRow
                                                    key={proyecto.id}
                                                    proyecto={proyecto}
                                                    modalidadesImportacion={modalidadesImportacion.data ?? []}
                                                    modalidadesTrabajo={modalidadesTrabajo.data ?? []}
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