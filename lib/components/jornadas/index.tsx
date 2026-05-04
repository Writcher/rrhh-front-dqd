'use client'

import { useSnackbar } from "@/lib/contexts/snackbar";
import { useForm } from "react-hook-form";
import { EmpleadosJornadasTableFiltersFormData } from "./types/empleadosJornadasTableFiltersFormData";
import { usePagination } from "@/lib/hooks/usePagination";
import { useFilters } from "@/lib/hooks/useFilters";
import { useSort } from "@/lib/hooks/useSort";
import { useQuery } from "@tanstack/react-query";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { getTiposEmpleado } from "@/lib/actions/tipoEmpleado/tipoEmpleado.actions";
import { getEmpleados } from "@/lib/actions/empleado/empleado.actions";
import { useEffect } from "react";
import { FilterBar } from "../common/filters/filterBar";
import { ActiveFilters } from "../common/filters/activeFilters";
import { getNombreById } from "@/lib/utils/getNombreById";
import TableWrapper from "../common/wrappers/tableWrapper";
import { TableHeader } from "../common/tables/tableHeader";
import { TableSkeleton } from "../common/tables/tableSkeleton";
import { Button, TableBody } from "@mui/material";
import { TableBase } from "../common/tables/tableBase";
import { EmpleadoItemDto } from "@/lib/types/empleado/get-empleado";
import { useExpand } from "@/lib/hooks/useExpand";
import EmpleadosJornadasTableRow from "./components/empleadosJornadasTableRow";
import { useUserRole } from "@/lib/hooks/useUserRole";
import Link from "next/link";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

export default function Jornadas() {
    //hooks
    const { showWarning } = useSnackbar();
    const { isAdministrativo } = useUserRole();
    const { setValue, watch } = useForm<EmpleadosJornadasTableFiltersFormData>({
        defaultValues: {
            nombre: '',
            nombreNormal: '',
            id_proyecto: '',
            legajo: '',
            legajoNormal: '',
            id_tipoempleado: '',
            manual: false,
        }
    });
    const filters = useFilters([
        { key: 'nombre', type: 'debounced-text', normalKey: 'nombreNormal', defaultVisible: true },
        { key: 'legajo', type: 'debounced-text', normalKey: 'legajoNormal' },
        { key: 'id_proyecto', type: 'select' },
        { key: 'id_tipoempleado', type: 'select' },
        { key: 'manual', type: 'toggle' }
    ], { setValue, watch }, { syncUrl: true });
    const sort = useSort({ col: 'nombre' });
    const pagination = usePagination({
        limit: 25,
        resetKey: `${watch('nombre')}-${watch('legajo')}-${watch('id_proyecto')}-${watch('id_tipoempleado')}-${watch('manual')}-${sort.column}-${sort.direction}`
    });
    const expand = useExpand({ syncUrl: true });
    //query
    const proyectos = useQuery({
        queryKey: ['getProyectos'],
        queryFn: () => getProyectos(),
        refetchOnWindowFocus: false
    });
    const tiposEmpleado = useQuery({
        queryKey: ['getTiposEmpleado'],
        queryFn: () => getTiposEmpleado(),
        refetchOnWindowFocus: false
    });
    const empleados = useQuery({
        queryKey: [
            'getEmpleados',
            pagination.page,
            pagination.limit,
            sort.column,
            sort.direction,
            watch('nombre'),
            watch('id_proyecto'),
            watch('legajo'),
            watch('id_tipoempleado'),
            watch('manual')
        ],
        queryFn: () => getEmpleados({
            page: pagination.page,
            limit: pagination.limit,
            column: sort.column,
            direction: sort.direction,
            nombre: watch('nombre'),
            id_proyecto: watch('id_proyecto'),
            legajo: watch('legajo'),
            id_tipoempleado: watch('id_tipoempleado'),
            manual: watch('manual')
        })
    });
    //feedback
    useEffect(() => {
        if (proyectos.isError) showWarning('Error al cargar proyectos');
        if (tiposEmpleado.isError) showWarning('Error al cargar tipos de empleado');
        if (empleados.isError) showWarning('Error al cargar empleados');
    }, [proyectos.isError, tiposEmpleado.isError, empleados.isError, showWarning]);
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            {/** Filtros */}
            <FilterBar
                filtersHook={filters}
                items={[
                    { key: 'nombre', menuLabel: 'Buscar por Nombre', inputLabel: 'Nombre de Empleado', inputType: 'text', value: watch('nombreNormal') },
                    { key: 'legajo', menuLabel: 'Buscar por Legajo', inputLabel: 'Legajo', inputType: 'number', value: watch('legajoNormal') },
                    { key: 'id_proyecto', menuLabel: 'Filtrar por Proyecto', inputLabel: 'Proyecto', inputType: 'select', options: proyectos.data, value: watch('id_proyecto') },
                    { key: 'id_tipoempleado', menuLabel: 'Filtrar por Tipo de Empleado', inputLabel: 'Tipo de Empleado', inputType: 'select', options: tiposEmpleado.data, value: watch('id_tipoempleado') },
                    { key: 'manual', inputLabel: 'Solo Marcas Manuales', inputType: 'toggle', value: watch('manual') }
                ]}
                actions={
                    <>
                        {!isAdministrativo &&
                            <Button
                                component={Link}
                                href={'/rrhh/jornadas/exportar'}
                                variant='contained'
                                color='success'
                                className='!h-10'
                                disableElevation
                                endIcon={<DownloadRoundedIcon />}
                            >
                                Exportar Resumen
                            </Button>
                        }
                    </>
                }
            />
            {/** Filtros Activos */}
            <ActiveFilters
                activeFilters={filters.activeFilters}
                handleCleanFilter={filters.handleCleanFilter}
                filters={[
                    { key: 'nombre', variant: 'text' },
                    { key: 'legajo', variant: 'text' },
                    { key: 'id_proyecto', variant: 'select', util: getNombreById(proyectos.data ?? []) },
                    { key: 'id_tipoempleado', variant: 'select', util: getNombreById(tiposEmpleado.data ?? []) },
                    { key: 'manual', variant: 'toggle', name: 'Solo Marcas Manuales' }
                ]}
            />
            {/** Tabla */}
            <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                <TableWrapper
                    isLoading={empleados.isLoading}
                    page={pagination.page}
                    limit={pagination.limit}
                    handlePageChange={pagination.handlePageChange}
                    handleLimitChange={pagination.handleLimitChange}
                    total={empleados.data?.totalEmpleados ?? 0}
                >
                    <TableBase
                        items={empleados.data?.empleados ?? []}
                        isLoading={empleados.isLoading}
                        header={
                            <TableHeader
                                titles={[
                                    { title: 'Legajo', width: '10%', alignment: 'center', column: 'legajo', onClick: () => sort.handleSort('legajo') },
                                    { title: 'DNI', width: '10%', alignment: 'center', column: 'dni', onClick: () => sort.handleSort('dni') },
                                    { title: 'Nombre y Apellido', width: '80%', alignment: 'left', column: 'nombre', onClick: () => sort.handleSort('nombre') }
                                ]}
                                sortColumn={sort.column}
                                sortDirection={sort.direction}
                            />
                        }
                        skeleton={
                            <TableSkeleton
                                rows={10}
                                columns={[
                                    { variant: 'text', alignment: 'center', colWidth: '10%', width: 75 },
                                    { variant: 'text', alignment: 'center', colWidth: '10%', width: 75 },
                                    { variant: 'text', alignment: 'left', colWidth: '80%', width: 200 },
                                ]}
                            />
                        }
                        body={
                            <TableBody>
                                {(empleados.data?.empleados ?? [])
                                    .map((empleado: EmpleadoItemDto) => (
                                        <EmpleadosJornadasTableRow
                                            key={empleado.id}
                                            empleado={empleado}
                                            expanded={expand.expanded === empleado.id}
                                            onClick={() => expand.handleExpand(empleado.id)}
                                        />
                                    ))}
                            </TableBody>
                        }
                        noItemMessage='No se encontraron empleados'
                        containerClassName='outer-table-container flex-1 overflow-auto'
                    />
                </TableWrapper>
            </div>
        </div>
    );
};