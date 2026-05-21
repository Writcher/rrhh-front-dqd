export type ControlesItemDto = {
    id: number;
    serie: string;
    id_proyecto: number;
    proyectonombre: string;
};

export type ControlesPaginatedResponseDto = {
    controles: ControlesItemDto[];
    totalControles: number;
};