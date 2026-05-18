'use server'

import CONFIG from '@/config'
import { ProyectosPaginatedResponseDto } from '@/lib/types/proyecto/get-proyecto-paginated';
import { Proyecto } from '@/lib/types/proyecto/proyecto.entity'
import { getToken } from '@/lib/utils/getToken';

export async function getProyectos(): Promise<Proyecto[]> {
    try {
        const token = await getToken();

        const proyectos = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_PROYECTO}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!proyectos.ok) throw new Error(`Error getting proyectos: ${proyectos.status} - ${proyectos.statusText}`);

        return await proyectos.json();
    } catch (error) {
        console.error('Get proyecto failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getProyectosPaginated(params: { page: number, limit: number }): Promise<ProyectosPaginatedResponseDto> {
    try {
        const token = await getToken();

        const proyectosURLParams = new URLSearchParams({
            page: params.page.toString(),
            limit: params.limit.toString()
        });

        const proyectos = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_PROYECTO}/paginated?${proyectosURLParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!proyectos.ok) throw new Error(`Error getting proyectos: ${proyectos.status} - ${proyectos.statusText}`);

        return await proyectos.json();
    } catch (error) {
        console.error('Get proyecto failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getProyectoById(params: { id: number }): Promise<Proyecto> {
    try {
        const proyecto = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_PROYECTO}/${params.id}`, {
            method: 'GET'
        });

        if (!proyecto.ok) {
            throw new Error(`Error getting proyecto with id ${params.id}: ${proyecto.status} - ${proyecto.statusText}`);
        };

        return await proyecto.json();
    } catch (error) {
        console.error('Get proyecto failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function createProyecto(params: { nombre: string, nomina: string, id_modalidadtrabajo: number, id_modalidadimportacion: number }): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_PROYECTO}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: params.nombre,
                nomina: params.nomina,
                id_modalidadtrabajo: params.id_modalidadtrabajo,
                id_modalidadimportacion: params.id_modalidadimportacion
            })
        });

        if (!respuesta.ok) throw new Error(`Error creating proyecto: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Create proyecto failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function deactivateProyecto(params: { id: number }): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_PROYECTO}/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error(`Error deactivating Proyecto with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Deactivate proyecto failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function editProyecto(params: { id: number, nombre: string, nomina?: string, id_modalidadtrabajo: number, id_modalidadimportacion: number }): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_PROYECTO}/${params.id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                nombre: params.nombre,
                nomina: params.nomina,
                id_modalidadtrabajo: params.id_modalidadtrabajo,
                id_modalidadimportacion: params.id_modalidadimportacion
            })
        });

        if (!respuesta.ok) throw new Error(`Error editing proyecto with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Edit proyecto failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};
