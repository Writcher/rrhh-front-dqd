import { ObservacionItemDto } from "@/lib/types/observacion/get-observacion-empleado"
import { TableRowCell } from "../../common/tables/tableRowCell"
import { TableRow } from "@mui/material"
import { formatFechaDiaSemana } from "@/lib/utils/formatFechaDiaSemana"

export default function EmpleadosJornadasInnerTableObservacionesRow({
    observacion
}: {
    observacion: ObservacionItemDto
}) {
    return (
        <TableRow>
            <TableRowCell alignment='left'>
                {formatFechaDiaSemana(observacion.fecha)}
            </TableRowCell>
            <TableRowCell alignment='center'>
                {observacion.texto}
            </TableRowCell>
        </TableRow>
    )
}