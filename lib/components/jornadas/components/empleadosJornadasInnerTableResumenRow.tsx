import { JornadaItemDto } from "@/lib/types/jornada/get-jornada"
import { TableRow } from "@mui/material"
import { TableRowCell } from "../../common/tables/tableRowCell"
import { ResumenItemDto } from "@/lib/types/jornada/get-resumen"
import { formatHorasMinutos } from "@/lib/utils/formatHorasMinutos"

export default function EmpleadosJornadasInnerTableResumenRow({
    resumen,
    isMensual
}: {
    resumen: ResumenItemDto,
    isMensual: boolean
}) {
    return (
        <>
            {isMensual
            ? (
                    <TableRow>
                        <TableRowCell alignment='center' label='Total'>
                            {formatHorasMinutos(Number(resumen.suma_total))}
                        </TableRowCell>
                        <TableRowCell alignment='center' label='Normal'>
                            {formatHorasMinutos(Number(resumen.suma_total_normal))}
                        </TableRowCell>
                        <TableRowCell alignment='center' label='50%'>
                            {formatHorasMinutos(Number(resumen.suma_total_50))}
                        </TableRowCell>
                        <TableRowCell alignment='center' label='100%'>
                            {formatHorasMinutos(Number(resumen.suma_total_100))}
                        </TableRowCell>
                        <TableRowCell alignment='center' label='Feriado'>
                            {formatHorasMinutos(Number(resumen.suma_total_feriado))}
                        </TableRowCell>
                        <TableRowCell alignment='center' label='Nocturno'>
                            {formatHorasMinutos(Number(resumen.suma_total_nocturno))}
                        </TableRowCell>
                    </TableRow >
                ) : (
                    <TableRow>
                        <TableRowCell alignment='center' label='Asistencias'>
                            {Number(resumen.total_asistencias)}
                        </TableRowCell>
                        <TableRowCell alignment='center' label='Aus. Justif.'>
                            {Number(resumen.total_ausencias_justificadas)}
                        </TableRowCell>
                        <TableRowCell alignment='center' label='Aus. Injustif.'>
                            {Number(resumen.total_ausencias_injustificadas)}
                        </TableRowCell>
                    </TableRow >
                )
            }
        </>
    )
}