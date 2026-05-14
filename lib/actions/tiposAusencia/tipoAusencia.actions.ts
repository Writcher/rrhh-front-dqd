'use server'

import CONFIG from '@/config';
import { TiposAusenciaPaginatedResponseDto } from '@/lib/types/tipoAusencia/get-tipoausencia-paginated';
import { TipoAusencia } from '@/lib/types/tipoAusencia/tipoAusencia.entity';
import { getToken } from '@/lib/utils/getToken';

export async function getTiposAusencia(): Promise<TipoAusencia[]> {
    try {
        const token = await getToken();

        const tiposAusencia = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_TIPOAUSENCIA}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!tiposAusencia.ok) throw new Error(`Error getting tiposAusencia: ${tiposAusencia.status} - ${tiposAusencia.statusText}`);

        return await tiposAusencia.json();
    } catch (error) {
        console.error('Get tiposAusencia failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getTiposAusenciaPaginated(params: { page: number, limit: number }): Promise<TiposAusenciaPaginatedResponseDto> {
    try {
        const token = await getToken();

        const tiposAusenciaURLParams = new URLSearchParams({
            page: params.page.toString(),
            limit: params.limit.toString()
        });

        const tiposAusencia = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_TIPOAUSENCIA}/paginated?${tiposAusenciaURLParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!tiposAusencia.ok) throw new Error(`Error getting tiposAusencia: ${tiposAusencia.status} - ${tiposAusencia.statusText}`);

        return await tiposAusencia.json();
    } catch (error) {
        console.error('Get tiposAusencia failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function editTipoAusencia(params: { id: number, nombre: string }): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_TIPOAUSENCIA}/${params.id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                nombre: params.nombre
            })
        });

        if (!respuesta.ok) throw new Error(`Error editing tipoAusencia with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Edit tiposAusencia failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function deleteTipoAusencia(params: { id: number }): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_TIPOAUSENCIA}/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error(`Error deleting tipoAusencia with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Delete tiposAusencia failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function createTipoAusencia(params: { nombre: string }): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_TIPOAUSENCIA}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: params.nombre
            })
        });

        if (!respuesta.ok) throw new Error(`Error creating tipoAusencia: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Create tiposAusencia failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};