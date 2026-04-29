'use client'

import { useSnackbar } from "@/lib/contexts/snackbar"
import { useForm } from "react-hook-form";
import { ImportacionesTableFiltersFormData } from "./types/importacionesTableFiltersFormData";
import { usePagination } from "@/lib/hooks/usePagination";
import { useFilters } from "@/lib/hooks/useFilters";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { useQuery } from "@tanstack/react-query";
import { getMeses } from "@/lib/actions/mes/mes.actions";
import { useEffect } from "react";
import { getImportaciones } from "@/lib/actions/importacion/importacion.actions";
import { FilterBar } from "../common/filters/filterBar";
import { getNombresMeses } from "@/lib/utils/getNombresMeses";
import { Button, TableBody } from "@mui/material";
import Link from "next/link";
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import { ActiveFilters } from "../common/filters/activeFilters";
import { getNombreById } from "@/lib/utils/getNombreById";
import TableWrapper from "../common/wrappers/tableWrapper";
import { TableSkeleton } from "../common/tables/tableSkeleton";
import { TableHeader } from "../common/tables/tableHeader";
import { TableBase } from "../common/tables/tableBase";
import { ImportacionItemDto } from "@/lib/types/importacion/get-importacion";
import ImportacionesTableRow from "./components/importacionesTableRow";
import { useUserRole } from "@/lib/hooks/useUserRole";

export default function Informes() {
    //hooks
    const { showWarning } = useSnackbar();
    const { isAdministrativo } = useUserRole();
    const { setValue, watch } = useForm<ImportacionesTableFiltersFormData>({
        defaultValues: {
            id_proyecto: '',
            id_mes: '',
            quincena: '',
            incompletas: false,
        }
    });
    const filters = useFilters([
        { key: 'id_proyecto', type: 'select', defaultVisible: true },
        { key: 'id_mes', type: 'select', group: 'periodo' },
        { key: 'quincena', type: 'select', group: 'periodo' },
        { key: 'incompletas', type: 'toggle' }
    ], { setValue, watch }, { syncUrl: true });
    const pagination = usePagination({
        limit: 25,
        resetKey: `${watch('id_proyecto')}-${watch('id_mes')}-${watch('quincena')}-${watch('incompletas')}`
    });
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
    const importaciones = useQuery({
        queryKey: [
            'getImportaciones',
            pagination.page,
            pagination.limit,
            watch('id_proyecto'),
            watch('id_mes'),
            watch('quincena'),
            watch('incompletas')
        ],
        queryFn: () => getImportaciones({
            page: pagination.page,
            limit: pagination.limit,
            id_proyecto: watch('id_proyecto'),
            id_mes: watch('id_mes'),
            quincena: watch('quincena'),
            incompletas: watch('incompletas')
        }),
        refetchOnWindowFocus: false
    });
    //feedback
    useEffect(() => {
        if (proyectos.isError) showWarning('Error al cargar proyectos');
        if (meses.isError) showWarning('Error al cargar meses');
        if (importaciones.isError) showWarning('Error al cargar importaciones');
    }, [proyectos.isError, meses.isError, importaciones.isError, showWarning]);
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            {/** Filtros */}
            <FilterBar
                filtersHook={filters}
                items={[
                    { key: 'id_proyecto', menuLabel: 'Filtrar por Proyecto', inputLabel: 'Proyecto', inputType: 'select', options: proyectos.data, loading: proyectos.isLoading, value: watch('id_proyecto') },
                    { key: 'id_mes', menuLabel: 'Filtrar por Mes', inputLabel: 'Mes', inputType: 'select', options: getNombresMeses(meses.data ?? []), loading: meses.isLoading, value: watch('id_mes') },
                    { key: 'quincena', inputLabel: 'Quincena', inputType: 'select', options: [{ id: 1, nombre: 'Primera Quincena' }, { id: 2, nombre: 'Segunda Quincena' }], value: watch('quincena') },
                    { key: 'incompletas', inputLabel: 'Solo Sin Verificar', inputType: 'toggle', value: watch('incompletas') }
                ]}
                actions={
                    <>
                        {isAdministrativo &&
                            <Button
                                component={Link}
                                href={'/administrativo/importaciones/importar'}
                                variant='contained'
                                color='success'
                                className='!h-10'
                                disableElevation
                                endIcon={<UploadFileRoundedIcon />}
                            >
                                Importar Informe
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
                    { key: 'id_proyecto', variant: 'select', util: getNombreById(proyectos.data ?? []) },
                    { key: 'id_mes', variant: 'select', util: getNombreById(getNombresMeses(meses.data ?? [])) },
                    { key: 'quincena', variant: 'select', util: getNombreById([{ id: 1, nombre: 'Primera Quincena' }, { id: 2, nombre: 'Segunda Quincena' }]) },
                    { key: 'incompletas', variant: 'toggle', name: 'Solo Sin Verificar' }
                ]}
            />
            {/** Tabla */}
            <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                <TableWrapper
                    isLoading={importaciones.isLoading}
                    page={pagination.page}
                    limit={pagination.limit}
                    handlePageChange={pagination.handlePageChange}
                    handleLimitChange={pagination.handleLimitChange}
                    total={importaciones.data?.totalImportaciones ?? 0}
                >
                    <TableBase
                        items={importaciones.data?.importaciones ?? []}
                        isLoading={importaciones.isLoading}
                        header={
                            <TableHeader
                                titles={[
                                    { title: 'Nombre', width: `${isAdministrativo ? '20%' : '25%'}`, alignment: 'left' },
                                    { title: 'Proyecto', width: `${isAdministrativo ? '20%' : '25%'}`, alignment: 'center' },
                                    { title: 'Usuario', width: `${isAdministrativo ? '20%' : '25%'}`, alignment: 'center' },
                                    { title: 'Estado', width: `${isAdministrativo ? '20%' : '25%'}`, alignment: 'center' },
                                    { title: 'Acciones', width: '20%', alignment: 'right', visible: isAdministrativo }
                                ]}
                            />
                        }
                        skeleton={
                            <TableSkeleton
                                rows={10}
                                columns={[
                                    { variant: 'text', alignment: 'left', colWidth: `${isAdministrativo ? '20%' : '25%'}`, width: 150 },
                                    { variant: 'text', alignment: 'center', colWidth: `${isAdministrativo ? '20%' : '25%'}`, width: 100 },
                                    { variant: 'text', alignment: 'center', colWidth: `${isAdministrativo ? '20%' : '25%'}`, width: 150 },
                                    { variant: 'rectangular', alignment: 'center', colWidth: `${isAdministrativo ? '20%' : '25%'}`, width: 100 },
                                    { variant: 'rectangular', alignment: 'right', colWidth: '20%', width: 120, visible: isAdministrativo }
                                ]}
                            />
                        }
                        body={
                            <TableBody>
                                {(importaciones.data?.importaciones ?? [])
                                    .map((importacion: ImportacionItemDto) => (
                                        <ImportacionesTableRow
                                            key={importacion.id}
                                            importacion={importacion}
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