import { Control } from "react-hook-form";
import { ExportFormData } from "../types/exportFromData";
import { Proyecto } from "@/lib/types/proyecto/proyecto.entity";
import { TipoEmpleado } from "@/lib/types/tipoEmpleado/tipoEmpleado.entity";
import { Mes } from "@/lib/types/mes/mes.entity";
import { ControlledSelect } from "@/lib/components/common/inputs/controlledSelect";
import { getNombresMeses } from "@/lib/utils/getNombresMeses";

export default function ExportarFormInputs({
    control,
    proyectos,
    tiposEmpleado,
    meses,
    isLoading
}: {
    control: Control<ExportFormData>,
    proyectos: Proyecto[],
    tiposEmpleado: TipoEmpleado[],
    meses: Mes[],
    isLoading: boolean
}) {
    return (
        <>
            <div className='flex flex-row w-full gap-2'>
                <ControlledSelect
                    control={control}
                    name='proyectos'
                    label='Proyecto'
                    rules={{ required: 'Debe seleccionar un proyecto' }}
                    isLoading={isLoading}
                    disabled={proyectos.length === 0}
                    multiple
                    items={proyectos}
                />
                <ControlledSelect
                    control={control}
                    name='id_tipoempleado'
                    label='Tipo de Empleado'
                    isLoading={isLoading}
                    disabled={tiposEmpleado.length === 0}
                    items={tiposEmpleado}
                />
            </div>
            <div className='flex flex-row w-full gap-2'>
                <ControlledSelect
                    control={control}
                    name='id_mes'
                    label='Mes'
                    rules={{ required: 'Debe seleccionar un mes' }}
                    isLoading={isLoading}
                    disabled={meses.length === 0}
                    items={getNombresMeses(meses)}
                />
                <ControlledSelect
                    control={control}
                    name='quincena'
                    label='Quincena'
                    isLoading={isLoading}
                    items={[{ id: 1, nombre: 'Primera Quincena' }, { id: 2, nombre: 'Segunda Quincena' }]}
                />
            </div>
        </>
    )
}