import { TableRowCell } from "@/lib/components/common/tables/tableRowCell";
import { TableRow } from "@mui/material";

export function InicioAsistenciaTableRow({ empleado, index }: { empleado: { nombre: string, tipoempleado: string }, index: number }) {
    return (
        <TableRow>
            <TableRowCell alignment='left' label='#'>
                {index}
            </TableRowCell>
            <TableRowCell alignment='center' label='Empleado'>
                {empleado.nombre}
            </TableRowCell>
            <TableRowCell alignment='right' label='Tipo'>
                {empleado.tipoempleado}
            </TableRowCell>
        </TableRow>
    );
};
