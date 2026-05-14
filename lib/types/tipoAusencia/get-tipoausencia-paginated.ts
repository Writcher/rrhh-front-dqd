export type TipoAusenciaItemDto = {
    id: number;
    nombre: string;
    estadoparametro?: string;
}

export type TiposAusenciaPaginatedResponseDto = {
    tiposAusencia: TipoAusenciaItemDto[];
    totalTiposAusencia: number;
}