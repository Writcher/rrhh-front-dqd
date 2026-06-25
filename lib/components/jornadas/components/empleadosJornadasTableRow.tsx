import { EmpleadoItemDto } from "@/lib/types/empleado/get-empleado";
import { TableRow } from "@mui/material";
import { TableRowCell } from "../../common/tables/tableRowCell";
import EmpleadosJornadasInnerTable from "./empleadosJornadasInnerTable";

export default function EmpleadosJornadasTableRow({
    empleado,
    expanded,
    onClick
}: {
    empleado: EmpleadoItemDto,
    expanded: boolean,
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
                        <EmpleadosJornadasInnerTable
                            canCreateManually={empleado.modalidadvalidacion === 'Manual'}
                            isMensual={empleado.es_mensualizado}
                            isActive={empleado.estadoempleado != 'baja'}
                            id={empleado.id}
                        />
                    </TableRowCell>
                </TableRow>
            }
        </>
    );
};