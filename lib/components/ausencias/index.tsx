'use client'

import { useSnackbar } from "@/lib/contexts/snackbar";
import { useForm } from "react-hook-form";
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
import { TableBody } from "@mui/material";
import { TableBase } from "../common/tables/tableBase";
import { EmpleadoItemDto } from "@/lib/types/empleado/get-empleado";
import { useExpand } from "@/lib/hooks/useExpand";
import { getTiposAusencia } from "@/lib/actions/tiposAusencia/tipoAusencia.actions";
import { EmpleadosAusenciasTableFiltersFormData } from "./type/empleadosAusenciasTableFiltersFormData";
import EmpleadosAusenciasTableRow from "./components/empleadosAusenciasTableRow";
import { getMeses } from "@/lib/actions/mes/mes.actions";
import { getDefaultMesQuincena } from "@/lib/utils/getDefaultMesQuincena";
import { getNombresMeses } from "@/lib/utils/getNombresMeses";

export default function Jornadas() {
    //hooks
    const { showWarning } = useSnackbar();
    const { setValue, watch } = useForm<EmpleadosAusenciasTableFiltersFormData>({
        defaultValues: {
            nombre: '',
            nombreNormal: '',
            id_proyecto: '',
            legajo: '',
            legajoNormal: '',
            id_tipoempleado: '',
            id_tipoausencia: '',
            id_mes: '',
            quincena: ''
        }
    });
    const filters = useFilters([
        { key: 'nombre', type: 'debounced-text', normalKey: 'nombreNormal' },
        { key: 'legajo', type: 'debounced-text', normalKey: 'legajoNormal' },
        { key: 'id_proyecto', type: 'select' },
        { key: 'id_tipoempleado', type: 'select' },
        { key: 'id_tipoausencia', type: 'select' },
        { key: 'id_mes', type: 'select', defaultVisible: true, group: 'periodo' },
        { key: 'quincena', type: 'select', defaultVisible: true, group: 'periodo' }
    ], { setValue, watch }, { syncUrl: true });
    const sort = useSort({ col: 'nombre' });
    const pagination = usePagination({
        limit: 25,
        resetKey: `${watch('nombre')}-${watch('legajo')}-${watch('id_proyecto')}-${watch('id_tipoempleado')}-${watch('id_tipoausencia')}-${watch('id_mes')}-${watch('quincena')}-${sort.column}-${sort.direction}`
    });
    const expand = useExpand({ syncUrl: true });
    //query
    const proyectos = useQuery({
        queryKey: ['getProyectos'],
        queryFn: () => getProyectos(),
        refetchOnWindowFocus: false
    });
    const meses = useQuery({
        queryKey: ['getMeses'],
        queryFn: () => getMeses(),
        refetchOnWindowFocus: false
    });
    const tiposEmpleado = useQuery({
        queryKey: ['getTiposEmpleado'],
        queryFn: () => getTiposEmpleado(),
        refetchOnWindowFocus: false
    });
    const tiposAusencia = useQuery({
        queryKey: ['getTiposAusencia'],
        queryFn: () => getTiposAusencia(),
        refetchOnReconnect: false
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
            watch('id_tipoausencia'),
            watch('id_mes'),
            watch('quincena')
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
            id_tipoausencia: watch('id_tipoausencia'),
            id_mes: watch('id_mes'),
            quincena: watch('quincena')
        }),
        enabled: watch('id_mes') !== '' && watch('quincena') !== ''
    });
    //defaults
    useEffect(() => {
        if (!meses.data || meses.data.length === 0) return;
        if (watch('id_mes') || watch('quincena')) return;
        const defaults = getDefaultMesQuincena(meses.data);
        if (!defaults) return;
        filters.handleChange('id_mes', defaults.id_mes);
        filters.handleChange('quincena', defaults.quincena);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meses.data]);
    //feedback
    useEffect(() => {
        if (proyectos.isError) showWarning('Error al cargar proyectos');
        if (tiposEmpleado.isError) showWarning('Error al cargar tipos de empleado');
        if (tiposAusencia.isError) showWarning('Error al carga tipos de ausencia');
        if (meses.isError) showWarning('Error al cargar meses');
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
                    { key: 'id_tipoausencia', menuLabel: 'Filtrar por Tipo de Ausencia', inputLabel: 'Tipo de Ausencia', inputType: 'select', options: tiposAusencia.data, value: watch('id_tipoausencia') },
                    { key: 'id_mes', menuLabel: 'Filtrar por Mes', inputLabel: 'Mes', inputType: 'select', options: getNombresMeses(meses.data ?? []), value: watch('id_mes'), loading: meses.isLoading },
                    { key: 'quincena', inputLabel: 'Quincena', inputType: 'select', options: [{ id: 1, nombre: 'Primera Quincena' }, { id: 2, nombre: 'Segunda Quincena' }], value: watch('quincena') }
                ]}
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
                    { key: 'id_tipoausencia', variant: 'select', util: getNombreById(tiposAusencia.data ?? []) },
                    { key: 'id_mes', variant: 'select', util: getNombreById(getNombresMeses(meses.data ?? [])) },
                    { key: 'quincena', variant: 'select', util: getNombreById([{ id: 1, nombre: 'Primera Quincena' }, { id: 2, nombre: 'Segunda Quincena' }]) }
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
                                        <EmpleadosAusenciasTableRow
                                            key={empleado.id}
                                            empleado={empleado}
                                            id_mes={watch('id_mes')}
                                            quincena={watch('quincena')}
                                            id_tipoausencia={watch('id_tipoausencia')}
                                            expanded={expand.expanded === empleado.id}
                                            tiposAusencia={tiposAusencia.data ?? []}
                                            onClick={() => expand.handleExpand(empleado.id)}
                                        />
                                    ))}
                            </TableBody>
                        }
                        noItemMessage='No se encontraron empleados con ausencias en el periodo'
                        containerClassName='outer-table-container flex-1 overflow-auto'
                    />
                </TableWrapper>
            </div>
        </div>
    );
};