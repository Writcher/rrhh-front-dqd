'use client'

import { useSnackbar } from "@/lib/contexts/snackbar"
import { useFilters } from "@/lib/hooks/useFilters";
import { usePagination } from "@/lib/hooks/usePagination";
import { useForm } from "react-hook-form";
import { EmpleadosTableFiltersFormData } from "./types/empleadosTableFiltersFormData";
import { useSort } from "@/lib/hooks/useSort";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { getTiposEmpleado } from "@/lib/actions/tipoEmpleado/tipoEmpleado.actions";
import { getModalidadesValidacion } from "@/lib/actions/modalidadValidacion/modalidadValidacion.actions";
import { getEmpleados } from "@/lib/actions/empleado/empleado.actions";
import { syncEmpleados } from "@/lib/actions/features/sync/sync.actions";
import { useEffect } from "react";
import { getNombreById } from "@/lib/utils/getNombreById";
import TableWrapper from "../common/wrappers/tableWrapper";
import { TableBase } from "../common/tables/tableBase";
import { TableHeader } from "../common/tables/tableHeader";
import { TableSkeleton } from "../common/tables/tableSkeleton";
import { Button, TableBody } from "@mui/material";
import { ActiveFilters } from "../common/filters/activeFilters";
import { FilterBar } from "../common/filters/filterBar";
import Link from "next/link";
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded';
import SyncIcon from '@mui/icons-material/Sync';
import { EmpleadoItemDto } from "@/lib/types/empleado/get-empleado";
import EmpleadosTableRow from "./components/empleadosTableRow";
import { useUserRole } from "@/lib/hooks/useUserRole";

export default function Empleados() {
    //hooks
    const { showSuccess, showError, showWarning } = useSnackbar();
    const { isAdministrativo } = useUserRole();
    const { setValue, watch } = useForm<EmpleadosTableFiltersFormData>({
        defaultValues: {
            nombre: '',
            nombreNormal: '',
            id_proyecto: '',
            legajo: '',
            legajoNormal: '',
            id_tipoempleado: '',
        }
    });
    const filters = useFilters([
        { key: 'nombre', type: 'debounced-text', normalKey: 'nombreNormal', defaultVisible: true },
        { key: 'legajo', type: 'debounced-text', normalKey: 'legajoNormal' },
        { key: 'id_proyecto', type: 'select' },
        { key: 'id_tipoempleado', type: 'select' }
    ], { setValue, watch }, { syncUrl: true });
    const sort = useSort({ col: 'nombre' });
    const pagination = usePagination({
        limit: 25,
        resetKey: `${watch('nombre')}-${watch('legajo')}-${watch('id_proyecto')}-${watch('id_tipoempleado')}-${sort.column}-${sort.direction}`
    });
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
    const modalidadesValidacion = useQuery({
        queryKey: ['getModalidadesValidacion'],
        queryFn: () => getModalidadesValidacion(),
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
            watch('id_tipoempleado')
        ],
        queryFn: () => getEmpleados({
            page: pagination.page,
            limit: pagination.limit,
            column: sort.column,
            direction: sort.direction,
            nombre: watch('nombre'),
            id_proyecto: watch('id_proyecto'),
            legajo: watch('legajo'),
            id_tipoempleado: watch('id_tipoempleado')
        }),
        refetchOnWindowFocus: false
    });
    //mutation
    const sync = useMutation({
        mutationFn: () => syncEmpleados(),
        onSuccess: () => showSuccess('Empleados sincronizados correctamente'),
        onError: () => showError('Error al sincronizar empleados')
    });
    //feedback
    useEffect(() => {
        if (proyectos.isError) showWarning('Error al cargar proyectos');
        if (tiposEmpleado.isError) showWarning('Error al cargar tipos de empleado');
        if (modalidadesValidacion.isError) showWarning('Error al cargar modalidades de validacion');
        if (empleados.isError) showWarning('Error al cargar empleados');
    }, [proyectos.isError, tiposEmpleado.isError, modalidadesValidacion.isError, empleados.isError, showWarning]);
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
                ]}
                actions={
                    <>
                        <Button
                            variant='contained'
                            color='info'
                            size='small'
                            className='!h-10'
                            disableElevation
                            onClick={() => sync.mutate()}
                            disabled={sync.isPending}
                            endIcon={!sync.isPending ? <SyncIcon /> : <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />}
                        >
                            Sincronizar Empleados
                        </Button>
                        {isAdministrativo &&
                            <Button
                                variant='contained'
                                color='info'
                                size='small'
                                className='!h-10'
                                disableElevation
                                component={Link}
                                href={`/administrativo/empleados/asistencia`}
                                endIcon={<NumbersRoundedIcon />}
                            >
                                Consultar Asistencia
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
                    { key: 'id_tipoempleado', variant: 'select', util: getNombreById(tiposEmpleado.data ?? []) }
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
                                    { title: 'Legajo', width: '10%', alignment: 'left', column: 'legajo', onClick: () => sort.handleSort('legajo') },
                                    { title: 'DNI', width: '10%', alignment: 'center', column: 'dni', onClick: () => sort.handleSort('dni') },
                                    { title: 'Nombre y Apellido', width: '20%', alignment: 'center', column: 'nombre', onClick: () => sort.handleSort('nombre') },
                                    { title: 'Tipo de Empleado', width: '15%', alignment: 'center', column: 'id_tipoempleado', onClick: () => sort.handleSort('id_tipoempleado') },
                                    { title: 'Validacion', width: '10%', alignment: 'center', column: 'id_modalidadvalidacion', onClick: () => sort.handleSort('id_modalidadvalidacion') },
                                    { title: 'Proyecto', width: '15%', alignment: 'center', column: 'id_proyecto', onClick: () => sort.handleSort('id_proyecto') },
                                    { title: 'Estado', width: '10%', alignment: 'center', column: 'id_estadoempleado', onClick: () => sort.handleSort('id_estadoempleado') },
                                    { title: 'Acciones', width: '10%', alignment: 'right' }
                                ]}
                                sortColumn={sort.column}
                                sortDirection={sort.direction}
                            />
                        }
                        skeleton={
                            <TableSkeleton
                                rows={10}
                                columns={[
                                    { variant: 'text', alignment: 'left', colWidth: '10%', width: 75 },
                                    { variant: 'text', alignment: 'center', colWidth: '10%', width: 75 },
                                    { variant: 'text', alignment: 'center', colWidth: '20%', width: 200 },
                                    { variant: 'text', alignment: 'center', colWidth: '15%', width: 100 },
                                    { variant: 'text', alignment: 'center', colWidth: '10%', width: 100 },
                                    { variant: 'text', alignment: 'center', colWidth: '15%', width: 100 },
                                    { variant: 'rectangular', alignment: 'center', colWidth: '10%', width: 100 },
                                    { variant: 'rectangular', alignment: 'right', colWidth: '10%', width: 120 }
                                ]}
                            />
                        }
                        body={
                            <TableBody>
                                {(empleados.data?.empleados ?? [])
                                    .map((empleado: EmpleadoItemDto) => (
                                        <EmpleadosTableRow
                                            key={empleado.id}
                                            empleado={empleado}
                                            modalidadesValidacion={modalidadesValidacion.data ?? []}
                                        />
                                    ))}
                            </TableBody>
                        }
                        noItemMessage='No se encontraron empleados'
                        containerClassName='outer-table-container flex-1 overflow-auto'
                    />
                </TableWrapper>
            </div>
        </div >
    );
};