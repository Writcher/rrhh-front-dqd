'use server'

import CONFIG from '@/config';
import { ImportacionesResponseDto } from '@/lib/types/importacion/get-importacion';
import { getToken } from "@/lib/utils/getToken";

export async function getImportacionCountByProyecto(): Promise<number> {
    try {
        const token = await getToken();

        const total = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_IMPORTACION}/count`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!total.ok) throw new Error(`Error getting total importaciones: ${total.status} - ${total.statusText}`);

        return await total.json();
    } catch (error) {
        console.error('Get importacion count failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getImportacionCountForProyectos(): Promise<Record<number, number>> {
    try {
        const token = await getToken();

        const total = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_IMPORTACION}/count/all`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!total.ok) throw new Error(`Error getting total importaciones: ${total.status} - ${total.statusText}`);

        return await total.json();
    } catch (error) {
        console.error('Get importacion count failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getImportaciones(params: {
    id_proyecto: number | '',
    id_mes: number | '',
    quincena: number | '',
    incompletas: boolean,
    page: number,
    limit: number
}): Promise<ImportacionesResponseDto> {
    try {
        const token = await getToken();

        const importacionesParams: Record<string, string> = {
            page: params.page.toString(),
            limit: params.limit.toString()
        };

        if (params.id_proyecto !== '') importacionesParams.id_proyecto = params.id_proyecto.toString();
        if (params.id_mes !== '') importacionesParams.id_mes = params.id_mes.toString();
        if (params.quincena !== '' && params.id_mes !== '') importacionesParams.quincena = params.quincena.toString();
        if (params.incompletas) importacionesParams.incompletas = 'true';

        const importacionesURLParams = new URLSearchParams(importacionesParams);

        const importaciones = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_IMPORTACION}?${importacionesURLParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!importaciones.ok) throw new Error(`Error getting importaciones: ${importaciones.status} - ${importaciones.statusText}`);

        return await importaciones.json();
    } catch (error) {
        console.error('Get importaciones failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function deleteImportacion(params: { id: number }): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_IMPORTACION}/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error(`Error deleting importaciones with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Delete importacion failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    }
};

export async function setImportacionCompleta(params: { id: number }): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_IMPORTACION}/${params.id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!respuesta.ok) throw new Error(`Error setting importacion with id as complete ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Setting importacion as complete failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};