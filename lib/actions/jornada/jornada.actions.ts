'use server'

import CONFIG from '@/config';
import { JornadaResponseDto } from '@/lib/types/jornada/get-jornada';
import { JornadasImportacionResponseDto } from '@/lib/types/jornada/get-jornada-importacion';
import { ResumenResponseDto } from '@/lib/types/jornada/get-resumen';
import { getToken } from "@/lib/utils/getToken";

export async function getJornadas(params: {
    id_empleado: number,
    page: number,
    limit: number,
    id_mes: number | '',
    quincena: number | '',
    id_tipoausencia?: number | '',
    ausencias?: boolean
}): Promise<JornadaResponseDto> {
    try {
        const token = await getToken();

        const jornadasParams: Record<string, string> = {
            page: params.page.toString(),
            limit: params.limit.toString(),
        };

        if (params.id_mes !== '' && params.id_mes !== 0) jornadasParams.id_mes = params.id_mes.toString();
        if (params.quincena !== '' && params.quincena !== 0) jornadasParams.quincena = params.quincena.toString();

        if (params.ausencias) jornadasParams.ausencias = params.ausencias.toString();
        if (params.id_tipoausencia === '') {
            jornadasParams.id_tipoausencia = '0';
        } else if (params.id_tipoausencia != null) {
            jornadasParams.id_tipoausencia = params.id_tipoausencia.toString();
        };

        const jornadasUrlParams = new URLSearchParams(jornadasParams);

        const jornadas = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_EMPLEADO}/${params.id_empleado}/jornada?${jornadasUrlParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!jornadas.ok) throw new Error(`Error getting jornadas for employee with id ${params.id_empleado}: ${jornadas.status} - ${jornadas.statusText}`);

        return await jornadas.json();
    } catch (error) {
        console.error('Get jornadas failed: ', {
            id_empleado: params.id_empleado,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getResumen(params: {
    id_empleado: number,
    id_mes: number | '',
    quincena: number | ''
}): Promise<ResumenResponseDto> {
    try {
        const token = await getToken();

        const resumenParams: Record<string, string> = {};

        if (params.id_mes !== '' && params.id_mes !== 0) resumenParams.id_mes = params.id_mes.toString();
        if (params.quincena !== '' && params.quincena !== 0) resumenParams.quincena = params.quincena.toString();

        const resumenUrlParams = new URLSearchParams(resumenParams);

        const resumen = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_EMPLEADO}/${params.id_empleado}/resumen?${resumenUrlParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!resumen.ok) throw new Error(`Error jornadas for employee with id ${params.id_empleado}: ${resumen.status} - ${resumen.statusText}`);

        return await resumen.json();
    } catch (error) {
        console.error('Fetch resumen failed: ', {
            id_empleado: params.id_empleado,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getJornadasByImportacion(params: {
    id_importacion: number,
    page: number,
    limit: number
}): Promise<JornadasImportacionResponseDto> {
    try {
        const token = await getToken();

        const jornadasURLParams = new URLSearchParams({
            page: params.page.toString(),
            limit: params.limit.toString()
        });

        const jornadas = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_IMPORTACION}/${params.id_importacion}/jornada?${jornadasURLParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!jornadas.ok) throw new Error(`Error fetching jornadas: ${jornadas.status} - ${jornadas.statusText}`);

        return await jornadas.json();
    } catch (error) {
        console.error('Fetch jornadas failed: ', {
            id_importacion: params.id_importacion,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getAusenciasPendientesCountByProyecto(): Promise<number> {
    try {
        const token = await getToken();

        const total = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_JORNADA}/ausencias/pendiente/count`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!total.ok) throw new Error(`Error getting total ausencias pendientes: ${total.status} - ${total.statusText}`);

        return await total.json();
    } catch (error) {
        console.error('Get ausencias pendientes count failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function createJornada(params: {
    entrada: string | null,
    salida: string | null,
    entradaTarde: string | null,
    salidaTarde: string | null,
    fecha: string,
    id_tipojornada: number | '',
    id_tipoausencia: number | '',
    observacion: string,
    id_empleado: number,
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_JORNADA}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                entrada: params.entrada,
                salida: params.salida,
                entradaTarde: params.entradaTarde,
                salidaTarde: params.salidaTarde,
                fecha: params.fecha,
                id_tipojornada: params.id_tipojornada === '' ? undefined : params.id_tipojornada,
                id_tipoausencia: params.id_tipoausencia === '' ? undefined : params.id_tipoausencia,
                observacion: params.observacion,
                id_empleado: params.id_empleado
            }),
        });

        if (!respuesta.ok) throw new Error(`Error creating jornada: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Create jornada failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function editJornada(params: {
    id: number,
    entrada: string,
    salida: string
}): Promise<void> {
    try {
        const token = await getToken();

        if (params.entrada === '' || params.salida === '') throw new Error(`Error editing jornada with id ${params.id}: Params missing`);

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_JORNADA}/${params.id}/editar`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                entrada: params.entrada,
                salida: params.salida
            })
        });

        if (!respuesta.ok) throw new Error(`Error editing jornada with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json()
    } catch (error) {
        console.error('Edit jornada failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function deleteJornada(params: {
    id: number,
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_JORNADA}/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error(`Error deleting jornada with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Delete jornada failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function editJornadaTipoAusencia(params: {
    id: number,
    id_tipoausencia: number | ''
}) {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_JORNADA}/${params.id}/justificar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_tipoausencia: params.id_tipoausencia
            }),
        });

        if (!respuesta.ok) throw new Error(`Error editing jornada with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Edit jornada tipoAusencia failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function validateJornada(params: {
    id: number
}) {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_JORNADA}/${params.id}/validar`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!respuesta.ok) throw new Error(`Error validating jornada with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Validate jornada failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};