import { useSnackbar } from "@/lib/contexts/snackbar";
import { useForm } from "react-hook-form";
import { ConfiguracionControlesTableFilters } from "../types/configuracionControlesTableFilters";
import { useFilters } from "@/lib/hooks/useFilters";
import { usePagination } from "@/lib/hooks/usePagination";
import { useShow } from "@/lib/hooks/useShow";
import { useQuery } from "@tanstack/react-query";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { getControles } from "@/lib/actions/control/control.actions";
import { useEffect, useMemo } from "react";
import { getNombreById } from "@/lib/utils/getNombreById";
import { FilterBar } from "../../common/filters/filterBar";
import { Button, TableBody } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { ActiveFilters } from "../../common/filters/activeFilters";
import TableWrapper from "../../common/wrappers/tableWrapper";
import { TableBase } from "../../common/tables/tableBase";
import { TableHeader } from "../../common/tables/tableHeader";
import { TableSkeleton } from "../../common/tables/tableSkeleton";
import { ControlesItemDto } from "@/lib/types/control/get-control";
import ConfiguracionControlesTableRow from "./configuracionControlesTableRow";
import ConfiguracionControlesForm from "./configuracionControlesForm";

export default function ConfiguraciónControlesTab() {
    //hooks
    const { showWarning } = useSnackbar();
    const { setValue, watch } = useForm<ConfiguracionControlesTableFilters>({
        defaultValues: {
            id_proyecto: ''
        }
    });
    const filters = useFilters([
        { key: 'id_proyecto', type: 'select', defaultVisible: true }
    ], { setValue, watch }, { syncUrl: true });
    const pagination = usePagination({ limit: 25 });
    const show = useShow();
    //query
    const proyectos = useQuery({
        queryKey: ['getProyectos'],
        queryFn: () => getProyectos(),
        refetchOnWindowFocus: false
    });
    const controles = useQuery({
        queryKey: [
            'getControles',
            pagination.page,
            pagination.limit,
            watch('id_proyecto')
        ],
        queryFn: () => getControles({
            page: pagination.page,
            limit: pagination.limit,
            id_proyecto: watch('id_proyecto')
        })
    });
    //memo
    const getNombreProyecto = useMemo(() => getNombreById(proyectos.data ?? []), [proyectos.data]);
    //feedback
    useEffect(() => {
        if (proyectos.isError) showWarning('Error al cargar proyectos');
        if (controles.isError) showWarning('Error al cargar controles');
    }, [proyectos.isError, controles.isError, showWarning])
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            {show.show ? (
                <ConfiguracionControlesForm
                    proyectos={proyectos.data ?? []}
                    handleShow={show.handleShow}
                />
            ) : (
                <>
                    {/** Filtros */}
                    <FilterBar
                        filtersHook={filters}
                        showMenu={false}
                        showClean={true}
                        items={[
                            { key: 'id_proyecto', menuLabel: 'Filtrar por Proyecto', inputLabel: 'Proyecto', inputType: 'select', options: proyectos.data, value: watch('id_proyecto') },
                        ]}
                        actions={
                            <Button
                                variant='contained'
                                color='success'
                                size='small'
                                className='!h-10'
                                disableElevation
                                onClick={show.handleShow}
                                startIcon={<AddRoundedIcon />}
                            >
                                Crear Control
                            </Button>
                        }
                    />
                    {/** Tabla */}
                    <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                        <TableWrapper
                            isLoading={controles.isLoading}
                            page={pagination.page}
                            limit={pagination.limit}
                            handlePageChange={pagination.handlePageChange}
                            handleLimitChange={pagination.handleLimitChange}
                            total={controles.data?.totalControles ?? 0}
                        >
                            <TableBase
                                items={controles.data?.controles ?? []}
                                isLoading={controles.isLoading}
                                header={
                                    <TableHeader
                                        titles={[
                                            { title: 'Numero de Serie', width: '33%', alignment: 'left' },
                                            { title: 'Proyecto', width: '33%', alignment: 'center' },
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
                                        {(controles.data?.controles ?? [])
                                            .map((control: ControlesItemDto) => (
                                                <ConfiguracionControlesTableRow
                                                    key={control.id}
                                                    control={control}
                                                    proyectos={proyectos.data ?? []}
                                                />
                                            ))}
                                    </TableBody>
                                }
                                noItemMessage='No se encontraron controles'
                                containerClassName='outer-table-container flex-1 overflow-auto'
                            />
                        </TableWrapper>
                    </div>
                </>
            )}
        </div>
    );
};