import { useSnackbar } from "@/lib/contexts/snackbar";
import { useFilters } from "@/lib/hooks/useFilters";
import { usePagination } from "@/lib/hooks/usePagination";
import { useShow } from "@/lib/hooks/useShow";
import { useForm } from "react-hook-form";
import { ConfiguracionUsuariosTableFilters } from "../types/configuracionUsuariosTableFilters";
import { getProyectos } from "@/lib/actions/proyecto/proyecto.actions";
import { useQuery } from "@tanstack/react-query";
import { getTiposUsuario } from "@/lib/actions/tipoUsuario/tipoUsuario.actions";
import { useSort } from "@/lib/hooks/useSort";
import { getUsuarios } from "@/lib/actions/usuario/usuario.actions";
import { useEffect, useMemo } from "react";
import { FilterBar } from "../../common/filters/filterBar";
import { ActiveFilters } from "../../common/filters/activeFilters";
import { getNombreById } from "@/lib/utils/getNombreById";
import TableWrapper from "../../common/wrappers/tableWrapper";
import { Button, TableBody } from "@mui/material";
import { TableSkeleton } from "../../common/tables/tableSkeleton";
import { TableHeader } from "../../common/tables/tableHeader";
import { TableBase } from "../../common/tables/tableBase";
import { useUserRole } from "@/lib/hooks/useUserRole";
import { UsuarioItemDto } from "@/lib/types/usuario/get-usuario";
import ConfiguracionUsuariosTableRow from "./configuracionUsuariosTableRow";
import ConfiguracionUsuariosForm from "./configuracionUsuariosForm";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function ConfiguracionUsuariosTab() {
    //hooks
    const { showWarning } = useSnackbar();
    const { isRRHH } = useUserRole();
    const { setValue, watch } = useForm<ConfiguracionUsuariosTableFilters>({
        defaultValues: {
            id_proyecto: '',
            id_tipousuario: '',
            nombre: '',
            nombreNormal: '',
            email: '',
            emailNormal: ''
        }
    });
    const filters = useFilters([
        { key: 'nombre', type: 'debounced-text', normalKey: 'nombreNormal' },
        { key: 'email', type: 'debounced-text', normalKey: 'emailNormal', defaultVisible: true },
        { key: 'id_proyecto', type: 'select' },
        { key: 'id_tipousuario', type: 'select' }
    ], { setValue, watch }, { syncUrl: true });
    const pagination = usePagination({ limit: 25 });
    const sort = useSort({ col: 'id_tipousuario' });
    const show = useShow();
    //query
    const proyectos = useQuery({
        queryKey: ['getProyectos'],
        queryFn: () => getProyectos(),
        refetchOnWindowFocus: false
    });
    const tiposUsuario = useQuery({
        queryKey: ['getTiposUsuario'],
        queryFn: () => getTiposUsuario(),
        refetchOnWindowFocus: false
    });
    const usuarios = useQuery({
        queryKey: [
            'getUsuarios',
            pagination.page,
            pagination.limit,
            sort.column,
            sort.direction,
            watch('nombre'),
            watch('email'),
            watch('id_proyecto'),
            watch('id_tipousuario')
        ],
        queryFn: () => getUsuarios({
            page: pagination.page,
            limit: pagination.limit,
            column: sort.column,
            direction: sort.direction,
            nombre: watch('nombre'),
            email: watch('email'),
            id_proyecto: watch('id_proyecto'),
            id_tipousuario: watch('id_tipousuario'),
            isRRHH: isRRHH
        })
    });
    //memo
    const tiposUsuarioDisponibles = useMemo(
        () => tiposUsuario.data?.filter((tipoUsuario) => !isRRHH || tipoUsuario.nombre !== 'Administrador'),
        [tiposUsuario.data, isRRHH]
    )
    const getNombreProyecto = useMemo(() => getNombreById(proyectos.data ?? []), [proyectos.data]);
    const getNombreTipoUsuario = useMemo(() => getNombreById(tiposUsuario.data ?? []), [tiposUsuario.data]);
    //feedback
    useEffect(() => {
        if (proyectos.isError) showWarning('Error al cargar proyectos');
        if (tiposUsuario.isError) showWarning('Error al cargar tipos de usuario');
        if (usuarios.isError) showWarning('Error al cargar usuarios');
    }, [proyectos.isError, tiposUsuario.isError, usuarios.isError, showWarning])
    return (
        <div className='flex flex-col gap-2 w-full h-full overflow-hidden'>
            {show.show ? (
                <ConfiguracionUsuariosForm
                    proyectos={proyectos.data ?? []}
                    tiposUsuario={tiposUsuarioDisponibles ?? []}
                    handleShow={show.handleShow}
                />
            ) : (
                <>
                    {/** Filtros */}
                    <FilterBar
                        filtersHook={filters}
                        items={[
                            { key: 'nombre', menuLabel: 'Buscar por Nombre', inputLabel: 'Nombre de Empleado', inputType: 'text', value: watch('nombreNormal') },
                            { key: 'email', menuLabel: 'Buscar por Email', inputLabel: 'Email', inputType: 'text', value: watch('emailNormal') },
                            { key: 'id_proyecto', menuLabel: 'Filtrar por Proyecto', inputLabel: 'Proyecto', inputType: 'select', options: proyectos.data, value: watch('id_proyecto') },
                            { key: 'id_tipousuario', menuLabel: 'Filtrar por Tipo de Usuario', inputLabel: 'Tipo de Usuario', inputType: 'select', options: tiposUsuarioDisponibles, value: watch('id_tipousuario') },
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
                                Crear Usuario
                            </Button>
                        }
                    />
                    {/** Filtros Activos */}
                    <ActiveFilters
                        activeFilters={filters.activeFilters}
                        handleCleanFilter={filters.handleCleanFilter}
                        filters={[
                            { key: 'nombre', variant: 'text' },
                            { key: 'email', variant: 'text' },
                            { key: 'id_proyecto', variant: 'select', util: getNombreProyecto },
                            { key: 'id_tipousuario', variant: 'select', util: getNombreTipoUsuario }
                        ]}
                    />
                    {/** Tabla */}
                    <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                        <TableWrapper
                            isLoading={usuarios.isLoading}
                            page={pagination.page}
                            limit={pagination.limit}
                            handlePageChange={pagination.handlePageChange}
                            handleLimitChange={pagination.handleLimitChange}
                            total={usuarios.data?.totalUsuarios ?? 0}
                        >
                            <TableBase
                                items={usuarios.data?.usuarios ?? []}
                                isLoading={usuarios.isLoading}
                                header={
                                    <TableHeader
                                        titles={[
                                            { title: 'Nombre', width: '17%', alignment: 'left', column: 'nombre', onClick: () => sort.handleSort('nombre') },
                                            { title: 'Email', width: '17%', alignment: 'center', column: 'email', onClick: () => sort.handleSort('email') },
                                            { title: 'Proyecto', width: '17%', alignment: 'center', column: 'id_proyecto', onClick: () => sort.handleSort('id_proyecto') },
                                            { title: 'Tipo de Usuario', width: '17%', alignment: 'center', column: 'id_tipousuario', onClick: () => sort.handleSort('id_tipousuario') },
                                            { title: 'Estado de Usuario', width: '17%', alignment: 'center', column: 'id_estadousuario', onClick: () => sort.handleSort('id_estadousuario') },
                                            { title: 'Acciones', width: '17%', alignment: 'right' }

                                        ]}
                                        sortColumn={sort.column}
                                        sortDirection={sort.direction}
                                    />
                                }
                                skeleton={
                                    <TableSkeleton
                                        rows={10}
                                        columns={[
                                            { variant: 'text', alignment: 'center', colWidth: '17%', width: 150 },
                                            { variant: 'text', alignment: 'center', colWidth: '17%', width: 150 },
                                            { variant: 'text', alignment: 'center', colWidth: '17%', width: 75 },
                                            { variant: 'text', alignment: 'center', colWidth: '17%', width: 75 },
                                            { variant: 'rectangular', alignment: 'center', colWidth: '17%', width: 75 },
                                            { variant: 'rectangular', alignment: 'center', colWidth: '17%', width: 75 },
                                        ]}
                                    />
                                }
                                body={
                                    <TableBody>
                                        {(usuarios.data?.usuarios ?? [])
                                            .map((usuario: UsuarioItemDto) => (
                                                <ConfiguracionUsuariosTableRow
                                                    key={usuario.id}
                                                    usuario={usuario}
                                                    proyectos={proyectos.data ?? []}
                                                    tiposUsuario={tiposUsuarioDisponibles ?? []}
                                                />
                                            ))}
                                    </TableBody>
                                }
                                noItemMessage='No se encontraron usuarios'
                                containerClassName='outer-table-container flex-1 overflow-auto'
                            />
                        </TableWrapper>
                    </div>
                </>
            )}
        </div>
    );
};