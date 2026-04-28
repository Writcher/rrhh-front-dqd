type observacionItem = {
    id: number;
    texto: string;
};

export type JornadaItemDto = {
    id: number;
    fecha: Date;
    entrada: string;
    salida: string;
    entrada_r: string;
    salida_r: string;
    total: number;
    tipojornada: string;
    id_tipojornada: number;
    tipoausencia: string;
    id_tipoausencia: number;
    es_manual: boolean;
    observaciones: observacionItem[];
};

export type JornadaResponseDto = {
    jornadas: JornadaItemDto[];
    totalJornadas: number;
};