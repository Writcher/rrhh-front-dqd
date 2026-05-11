'use server'

import CONFIG from '@/config';
import { UsuariosResponseDto } from '@/lib/types/usuario/get-usuario';
import { Usuario } from "@/lib/types/usuario/usuario.entity";
import { getToken } from '@/lib/utils/getToken';

export async function getUsuarioByEmail(params: { email: string }): Promise<Usuario> {
    try {
        const usuarioUrlParams = new URLSearchParams({
            email: params.email
        });

        const usuario = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_LOGIN}?${usuarioUrlParams}`, {
            method: 'GET'
        });

        if (!usuario.ok) throw new Error(`Error getting usuario: ${usuario.status} - ${usuario.statusText}`);

        return await usuario.json();
    } catch (error) {
        console.error('Get usuario failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getUsuarios(params: {
    page: number,
    limit: number,
    column: string,
    direction: 'ASC' | 'DESC',
    nombre: string,
    email: string,
    id_proyecto: number | '',
    id_tipousuario: number | '',
    isRRHH: boolean
}): Promise<UsuariosResponseDto> {
    try {
        const token = await getToken();

        const usuariosParams: Record<string, string> = {
            page: params.page.toString(),
            limit: params.limit.toString(),
            column: params.column,
            direction: params.direction,
        };

        if (params.nombre !== '') usuariosParams.nombre = params.nombre;
        if (params.email !== '') usuariosParams.email = params.email;
        if (params.id_proyecto !== '') usuariosParams.id_proyecto = params.id_proyecto.toString();
        if (params.id_tipousuario !== '') usuariosParams.id_tipousuario = params.id_tipousuario.toString();
        if (params.isRRHH) usuariosParams.isRRHH = params.isRRHH.toString();

        const usuariosURLParams = new URLSearchParams(usuariosParams);

        const usuarios = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_USUARIO}?${usuariosURLParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!usuarios.ok) throw new Error(`Error fetching usuarios: ${usuarios.status} - ${usuarios.statusText}`);

        return await usuarios.json();
    } catch (error) {
        console.error('Get usuarios failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function createUsuario(params: {
    nombre: string,
    email: string,
    contraseña: string,
    id_proyecto: number | '',
    id_tipousuario: number | ''
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_USUARIO}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nombre: params.nombre,
                email: params.email,
                contraseña: params.contraseña,
                id_proyecto: params.id_proyecto,
                id_tipousuario: params.id_tipousuario
            }),
        });

        if (!respuesta.ok) throw new Error(`Error creating usuario: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Create usuario failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function editUsuario(params: {
    id: number,
    id_proyecto: number | '',
    id_tipousuario: number | '',
    nombre: string,
    email: string
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_USUARIO}/${params.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nombre: params.nombre,
                email: params.email,
                id_tipousuario: params.id_tipousuario,
                id_proyecto: params.id_proyecto
            }),
        });

        if (!respuesta.ok) throw new Error(`Error editing usuario with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Edit usuario failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function editUsuarioPassword(params: {
    id: number,
    contraseña: string
}): Promise<void> {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_USUARIO}/${params.id}/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                contraseña: params.contraseña
            }),
        });

        if (!respuesta.ok) throw new Error(`Error editing usuario with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Edit usuario failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function deleteUsuario(params: {
    id: number
}) {
    try {
        const token = await getToken();

        const respuesta = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_USUARIO}/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!respuesta.ok) throw new Error(`Error deleting usuario with id ${params.id}: ${respuesta.status} - ${respuesta.statusText}`);

        return await respuesta.json();
    } catch (error) {
        console.error('Delete usuario failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};