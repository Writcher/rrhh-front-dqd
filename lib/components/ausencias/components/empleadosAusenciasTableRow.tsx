import { EmpleadoItemDto } from "@/lib/types/empleado/get-empleado";
import { TableRow } from "@mui/material";
import { TableRowCell } from "../../common/tables/tableRowCell";
import EmpleadosAusenciasInnerTable from "./empleadosAusenciasInnerTable";
import { TipoAusencia } from "@/lib/types/tipoAusencia/tipoAusencia.entity";

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
    return (
        <>
            <TableRow
                onClick={onClick}
                className={`cursor-pointer ${expanded ? 'bg-orange-100' : ''}`}
            >
                <TableRowCell alignment='center'>
                    {empleado.legajo}
                </TableRowCell>
                <TableRowCell alignment='center'>
                    {empleado.dni}
                </TableRowCell>
                <TableRowCell alignment='left'>
                    {empleado.nombre}
                </TableRowCell>
            </TableRow>
            {expanded &&
                <TableRow
                    className={`cursor-pointer ${expanded ? 'bg-orange-100' : ''}`} 
                >
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
        </>
    );
};