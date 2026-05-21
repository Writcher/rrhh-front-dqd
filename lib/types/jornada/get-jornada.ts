type observacionItem = {
    id: number;
    texto: string;
};

type auditoriaJornadaItem = {
    id: number;
    entrada_anterior: string | null;
    salida_anterior: string | null;
    fecha: Date;
    usuario: string;
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
    auditorias: auditoriaJornadaItem[];
};

export type JornadaResponseDto = {
    jornadas: JornadaItemDto[];
    totalJornadas: number;
};