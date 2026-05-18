export type ProyectoItemDto = {
    id: number;
    nombre: string;
    nomina: string;
    modalidadtrabajo: string;
    modalidadimportacion: string;
    estadoparametro: string;
    id_modalidadtrabajo: number;
    id_modalidadimportacion: number;
};

export type ProyectosPaginatedResponseDto = {
    proyectos: ProyectoItemDto[];
    totalProyectos: number;
};