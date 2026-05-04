import { Button } from "@mui/material";
import { StatsCard } from "@/lib/components/common/components/statsCard";
import Link from "next/link";
import { AsistenciaResponseDto } from "@/lib/types/features/asistencia/asistencia-response";
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded';
import SearchIcon from '@mui/icons-material/Search';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';

const categories = [
    { category: 'Presentes', key: 'totalPresentes' },
    { category: 'Jornaleros Presentes', key: 'totalJornaleros' },
    { category: 'Mensuales Presentes', key: 'totalMensuales' },
    { category: 'Ausentes', key: 'totalAusentes' },
] as const;

export function InicioStats({
    asistencia,
    importaciones,
    ausencias,
    proyecto
}: {
    asistencia: { data?: AsistenciaResponseDto, isLoading: boolean },
    importaciones: { data?: number, isLoading: boolean },
    ausencias: { data?: number, isLoading: boolean },
    proyecto: number
}) {
    return (
        <>
            <div className='flex flex-col gap-2 overflow-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2'>
                    {categories.map(({ category, key }) => (
                        <StatsCard key={key} category={category} total={asistencia.data?.[key]} isLoading={asistencia.isLoading} />
                    ))}
                </div>
                <div className='flex justify-start items-center border-2 border-orange-500 px-6 p-4 rounded text-gray-700 text-xs'>
                    Los controles de acceso deben estar encendidos y conectados a internet para el correcto funcionamiento del sistema.
                </div>
                <Button
                    component={Link}
                    href={`/administrativo/empleados/asistencia?id_proyecto=${proyecto}`}
                    variant='contained'
                    className='!bg-gray-800 !text-white !border-gray-800 hover:!bg-white hover:!text-orange-600 !border-2 hover:!border-orange-500'
                    disableElevation
                    fullWidth
                    endIcon={<NumbersRoundedIcon />}
                >
                    Consultar Asistencia de Otro Día
                </Button>
            </div>
            <div className='flex flex-col flex-1 gap-2'>
                <StatsCard category='Ausencias Pendientes de Justificación' total={ausencias.data} isLoading={ausencias.isLoading} />
                <Button
                    component={Link}
                    href={`/administrativo/ausencias?id_proyecto=${proyecto}&id_tipoausencia=3`}
                    variant='contained'
                    className='!bg-gray-800 !text-white !border-gray-800 hover:!bg-white hover:!text-orange-600 !border-2 hover:!border-orange-500'
                    disableElevation
                    fullWidth
                    endIcon={<SummarizeRoundedIcon />}
                >
                    Justificar Ausencias
                </Button>
                <StatsCard category='Importaciones Pendientes de Revisión' total={importaciones.data} isLoading={importaciones.isLoading} />
                <Button
                    component={Link}
                    href={`/administrativo/importaciones?id_proyecto=${proyecto}&incompletas=true`}
                    variant='contained'
                    className='!bg-gray-800 !text-white !border-gray-800 hover:!bg-white hover:!text-orange-600 !border-2 hover:!border-orange-500'
                    disableElevation
                    fullWidth
                    endIcon={<SearchIcon />}
                >
                    Revisar Importaciones
                </Button>
            </div>
        </>
    );
};
