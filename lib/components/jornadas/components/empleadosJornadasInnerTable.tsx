import { useSnackbar } from "@/lib/contexts/snackbar";
import { useForm } from "react-hook-form";
import { EmpleadosJornadasInnerTableFiltersFormData } from "../types/empleadosJornadasInnerTableFiltersFormData";
import { useTabs } from "@/lib/hooks/useTabs";
import { TableTabs } from "../../common/tables/tableTabs";
import { useFilters } from "@/lib/hooks/useFilters";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FilterBar } from "../../common/filters/filterBar";
import { getNombresMeses } from "@/lib/utils/getNombresMeses";
import { getDefaultMesQuincena } from "@/lib/utils/getDefaultMesQuincena";
import { getMeses } from "@/lib/actions/mes/mes.actions";
import EmpleadosJornadasInnerTableJornadasTab from "./empleadosJornadasInnerTableJornadasTab";
import EmpleadosJornadasInnerTableResumenTab from "./empleadosJornadasInnerTableResumenTab";
import { useShow } from "@/lib/hooks/useShow";
import { Button } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import JornadaForm from "./jornadaForm";
import { useUserRole } from "@/lib/hooks/useUserRole";

export default function EmpleadosJornadasInnerTable({
    isMensual,
    isActive,
    id
}: {
    isMensual: boolean,
    isActive: boolean,
    id: number
}) {
    //hooks
    const { showWarning } = useSnackbar();
    const { isAdministrativo } = useUserRole();
    const { setValue, watch } = useForm<EmpleadosJornadasInnerTableFiltersFormData>({
        defaultValues: {
            id_mes: '',
            quincena: ''
        }
    });
    const tab = useTabs({ tab: isAdministrativo ? 'jornadas' : 'resumen' });
    const filters = useFilters([
        { key: 'id_mes', type: 'select', group: 'periodo' },
        { key: 'quincena', type: 'select', group: 'periodo' }
    ], { setValue, watch });
    const show = useShow();
    //query
    const meses = useQuery({
        queryKey: ['getMeses'],
        queryFn: () => getMeses(),
        refetchOnWindowFocus: false
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
        if (meses.isError) showWarning('Error al cargar meses');
    }, [meses.isError, showWarning]);
    return (
        <div className='flex flex-col gap-2 w-full h-full py-2 px-4 overflow-hidden bg-white border-2 border-orange-500 rounded'>
            {show.show ? (
                <>
                    <JornadaForm 
                        id_empleado={id}
                        handleShow={show.handleShow}
                    />
                </>
            ) : (
                <>
                    {/** Tabs */}
                    <TableTabs
                        handleTabChange={(newTab: string) => tab.handleTabChange(null, newTab)}
                        activeTab={tab.tab}
                        tabs={[
                            { label: 'Resumen', value: 'resumen' },
                            { label: 'Jornadas', value: 'jornadas' }
                        ]}
                    />
                    {/** Filtros */}
                    <FilterBar
                        filtersHook={filters}
                        showMenu={false}
                        showClean={true}
                        items={[
                            { key: 'id_mes', menuLabel: 'Filtrar por Mes', inputLabel: 'Mes', inputType: 'select', options: getNombresMeses(meses.data ?? []), loading: meses.isLoading, value: watch('id_mes') },
                            { key: 'quincena', inputLabel: 'Quincena', inputType: 'select', options: [{ id: 1, nombre: 'Primera Quincena' }, { id: 2, nombre: 'Segunda Quincena' }], value: watch('quincena') }
                        ]}
                        actions={
                            <>
                                {isAdministrativo &&
                                    <Button
                                        variant='contained'
                                        color='success'
                                        size='small'
                                        className='!h-10'
                                        disableElevation
                                        disabled={!isActive}
                                        onClick={() => show.handleShow()}
                                        endIcon={<AddRoundedIcon />}
                                    >
                                        Carga Manual
                                    </Button>
                                }
                            </>
                        }
                    />
                    {/** Table */}
                    <div className='flex flex-col lg:flex-2 flex-1 gap-2 overflow-hidden'>
                        {tab.tab === 'jornadas'
                            ? (
                                <EmpleadosJornadasInnerTableJornadasTab
                                    id={id}
                                    idMes={watch('id_mes')}
                                    quincena={watch('quincena')}
                                />
                            ) : (
                                <EmpleadosJornadasInnerTableResumenTab
                                    id={id}
                                    isMensual={isMensual}
                                    idMes={watch('id_mes')}
                                    quincena={watch('quincena')}
                                />
                            )}
                    </div>
                </>
            )
            }
            {/** Tabs */}

        </div >
    );
};
