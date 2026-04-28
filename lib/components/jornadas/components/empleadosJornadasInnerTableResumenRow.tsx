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
                        <TableRowCell alignment='center'>
                            {formatHorasMinutos(Number(resumen.suma_total))}
                        </TableRowCell>
                        <TableRowCell alignment='center'>
                            {formatHorasMinutos(Number(resumen.suma_total_normal))}
                        </TableRowCell>
                        <TableRowCell alignment='center'>
                            {formatHorasMinutos(Number(resumen.suma_total_50))}
                        </TableRowCell>
                        <TableRowCell alignment='center'>
                            {formatHorasMinutos(Number(resumen.suma_total_100))}
                        </TableRowCell>
                        <TableRowCell alignment='center'>
                            {formatHorasMinutos(Number(resumen.suma_total_feriado))}
                        </TableRowCell>
                        <TableRowCell alignment='center'>
                            {formatHorasMinutos(Number(resumen.suma_total_nocturno))}
                        </TableRowCell>
                    </TableRow >
                ) : (
                    <TableRow>
                        <TableRowCell alignment='center'>
                            {Number(resumen.total_asistencias)}
                        </TableRowCell>
                        <TableRowCell alignment='center'>
                            {Number(resumen.total_ausencias_justificadas)}
                        </TableRowCell>
                        <TableRowCell alignment='center'>
                            {Number(resumen.total_ausencias_injustificadas)}
                        </TableRowCell>
                    </TableRow >
                )
            }
        </>
    )
}