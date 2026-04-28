export type ObservacionItemDto = {
    id: number;
    texto: string;
    fecha: string;
};

export type ObservacionesByEmpleadoResponseDto = {
    observaciones: ObservacionItemDto[];
    totalObservaciones: number;
};