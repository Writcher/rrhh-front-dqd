'use server'

import CONFIG from '@/config';
import { ControlesPaginatedResponseDto } from '@/lib/types/control/get-control';
import { getToken } from '@/lib/utils/getToken';

export async function getControles(params: {
    page: number,
    limit: number,
    id_proyecto: number | ''
}): Promise<ControlesPaginatedResponseDto> {
    try {
        const token = await getToken();

        const controlesParams: Record<string, string> = {
            page: params.page.toString(),
            limit: params.limit.toString(),
        };

        if (params.id_proyecto !== '') controlesParams.id_proyecto = params.id_proyecto.toString();

        const controlesURLParams = new URLSearchParams(controlesParams);

        const controles = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_CONTROL}?${controlesURLParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!controles.ok) throw new Error(`Error getting controles: ${controles.status} - ${controles.statusText}`);

        return await controles.json();
    } catch (error) {
        console.error('Get controles failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function createControl(params: {
    serie: string,
    id_proyecto: number | ''
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_CONTROL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                serie: params.serie,
                id_proyecto: params.id_proyecto
            })
        });

        if (!respuesta.ok) throw new Error(`Error creating control: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Create control failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function editControl(params: {
    id: number,
    serie: string,
    id_proyecto: number | ''
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_CONTROL}/${params.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                serie: params.serie,
                id_proyecto: params.id_proyecto
            }),
        });

        if (!respuesta.ok) throw new Error(`Error editing control with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Edit control failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function deleteControl(params: {
    id: number
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_CONTROL}/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error(`Error deleting control with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Delete control failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};