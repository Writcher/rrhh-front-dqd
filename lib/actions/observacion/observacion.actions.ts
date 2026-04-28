'use server'

import CONFIG from '@/config';
import { ObservacionesByEmpleadoResponseDto } from '@/lib/types/observacion/get-observacion-empleado';
import { getToken } from "@/lib/utils/getToken";

export async function getObservacionesByEmpleado(params: {
    id_empleado: number,
    id_mes: number | '',
    quincena: number | '',
    page: number,
    limit: number,
}): Promise<ObservacionesByEmpleadoResponseDto> {
    try {
        const token = await getToken();

        const observacionesParams: Record<string, string> = {
            page: params.page.toString(),
            limit: params.limit.toString(),
        };

        if (params.quincena !== '' && params.quincena !== 0) observacionesParams.quincena = params.quincena.toString();
        if (params.id_mes !== '' && params.id_mes !== 0)  observacionesParams.id_mes = params.id_mes.toString();

        const observacionesUrlParams = new URLSearchParams(observacionesParams);

        const observaciones = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_EMPLEADO}/${params.id_empleado}/observacion?${observacionesUrlParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!observaciones.ok) throw new Error(`Error getting observaciones for empleado with id ${params.id_empleado}: ${observaciones.status} - ${observaciones.statusText}`);

        return await observaciones.json();
    } catch (error) {
        console.error('Get observaciones failed: ', {
            id_empleado: params.id_empleado,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function createObservacion(params: {
    id_jornada: number,
    observacion: string
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_JORNADA}/${params.id_jornada}/observacion`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                texto: params.observacion
            }),
        });

        if (!respuesta.ok) throw new Error(`Error creating observacion: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Create observacion failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function deleteObservacion(params: {
    id: number
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_OBSERVACION}/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error(`Error deleting observacion with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Delete observacion failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};