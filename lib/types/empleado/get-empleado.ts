export type EmpleadoItemDto = {
    id: number;
    nombre: string;
    dni: string;
    legajo: number;
    id_proyecto: number;
    nombreproyecto: string;
    id_estadoempleado: number;
    estadoempleado: string;
    id_tipoempleado: number;
    tipoempleado: string;
    id_modalidadvalidacion: number;
    modalidadvalidacion: string;
    es_mensualizado: boolean;
    puesto: string;
};

export type EmpleadosResponseDto = {
    empleados: EmpleadoItemDto[];
    totalEmpleados: number;
};