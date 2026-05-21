import { EmpleadoItemDto } from "@/lib/types/empleado/get-empleado";
import { Drawer, IconButton, TableRow, useMediaQuery } from "@mui/material";
import { TableRowCell } from "../../common/tables/tableRowCell";
import EmpleadosAusenciasInnerTable from "./empleadosAusenciasInnerTable";
import { TipoAusencia } from "@/lib/types/tipoAusencia/tipoAusencia.entity";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function EmpleadosAusenciasTableRow({
    empleado,
    id_mes,
    quincena,
    id_tipoausencia,
    expanded,
    tiposAusencia,
    onClick
}: {
    empleado: EmpleadoItemDto,
    id_mes: number | '',
    quincena: number | '',
    id_tipoausencia: number | '',
    expanded: boolean,
    tiposAusencia: TipoAusencia[],
    onClick: () => void
}) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <>
            <TableRow
                onClick={onClick}
                className={`cursor-pointer ${expanded ? 'bg-orange-100' : ''}`}
            >
                <TableRowCell alignment='center' label='Legajo'>
                    {empleado.legajo}
                </TableRowCell>
                <TableRowCell alignment='center' label='DNI'>
                    {empleado.dni}
                </TableRowCell>
                <TableRowCell alignment='left' label='Nombre'>
                    {empleado.nombre}
                </TableRowCell>
            </TableRow>
            {expanded && !isMobile &&
                <TableRow className={`cursor-pointer ${expanded ? 'bg-orange-100' : ''}`}>
                    <TableRowCell alignment='center' span={3} variant='table'>
                        <EmpleadosAusenciasInnerTable
                            id={empleado.id}
                            id_mes={id_mes}
                            quincena={quincena}
                            id_tipoausencia={id_tipoausencia}
                            tiposAusencia={tiposAusencia}
                        />
                    </TableRowCell>
                </TableRow>
            }
            <Drawer
                anchor='right'
                open={expanded && isMobile}
                onClose={onClick}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: '100vw',
                        maxWidth: '100vw',
                        bgcolor: '#FFFFFF',
                    },
                }}
            >
                <div className='flex flex-col h-full w-full'>
                    <div className='flex shrink-0 items-center justify-between border-b-2 border-orange-500 px-2 py-2 gap-2'>
                        <div className='flex flex-col min-w-0'>
                            <span className='text-xs text-gray-500 uppercase tracking-wide'>Legajo {empleado.legajo}</span>
                            <span className='font-semibold text-gray-800 truncate'>{empleado.nombre}</span>
                        </div>
                        <IconButton onClick={onClick} color='warning' aria-label='Cerrar'>
                            <CloseRoundedIcon />
                        </IconButton>
                    </div>
                    <div className='flex flex-1 min-h-0 overflow-hidden p-2'>
                        <EmpleadosAusenciasInnerTable
                            id={empleado.id}
                            id_mes={id_mes}
                            quincena={quincena}
                            id_tipoausencia={id_tipoausencia}
                            tiposAusencia={tiposAusencia}
                        />
                    </div>
                </div>
            </Drawer>
        </>
    );
};
