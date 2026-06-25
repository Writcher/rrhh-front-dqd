'use server'

import CONFIG from '@/config'
import { EmpleadosResponseDto } from '@/lib/types/empleado/get-empleado';
import { getToken } from '@/lib/utils/getToken';

export async function getEmpleados(params: {
    nombre: string,
    id_proyecto: number | '',
    legajo: number | '',
    id_tipoempleado: number | '',
    id_tipoausencia?: number | '',
    id_mes?: number | '',
    quincena?: number | '',
    manual?: boolean,
    estado_acceso?: string,
    page: number,
    limit: number,
    column: string,
    direction: 'ASC' | 'DESC',
}): Promise<EmpleadosResponseDto> {
    try {
        const token = await getToken();

        const empleadosParams: Record<string, string> = {
            page: params.page.toString(),
            limit: params.limit.toString(),
            column: params.column,
            direction: params.direction,
            id_tipoausencia: params.id_tipoausencia != null ? params.id_tipoausencia.toString() === '' ? '0' : params.id_tipoausencia.toString() : '-1',
        };

        if (params.id_mes != undefined && params.id_mes !== '' && params.id_mes !== 0) empleadosParams.id_mes = params.id_mes.toString();
        if (params.quincena != undefined && params.quincena !== '' && params.quincena !== 0) empleadosParams.quincena = params.quincena.toString();
        if (params.manual) empleadosParams.manual = params.manual.toString();
        if (params.nombre !== '') empleadosParams.nombre = params.nombre;
        if (params.legajo !== '') empleadosParams.legajo = params.legajo.toString();
        if (params.id_tipoempleado !== '') empleadosParams.id_tipoempleado = params.id_tipoempleado.toString();
        if (params.id_proyecto !== '') empleadosParams.id_proyecto = params.id_proyecto.toString();
        if (params.estado_acceso !== undefined && params.estado_acceso !== '') empleadosParams.estado_acceso = params.estado_acceso;

        const empleadosURLParams = new URLSearchParams(empleadosParams);

        const empleados = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_EMPLEADO}?${empleadosURLParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!empleados.ok) throw new Error(`Error getting empleados: ${empleados.status} - ${empleados.statusText}`);

        return await empleados.json();
    } catch (error) {
        console.error('Get empleados failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function editEmpleado(params: {
    id_mdoalidadvalidacion: number,
    id: number
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_EMPLEADO}/${params.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id_modalidadvalidacion: params.id_mdoalidadvalidacion
            })
        });

        if (!respuesta.ok) throw new Error(`Error editing empleado with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Edit empleado failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function deactivateEmpleado(params: {
    id: number
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_EMPLEADO}/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error(`Error deactivating empleado with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Deactivate empleado failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};