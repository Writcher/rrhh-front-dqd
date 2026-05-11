'use server'

import CONFIG from '@/config';
import { TipoUsuario } from '@/lib/types/tipoUsuario/tipoUsuario.entity';
import { getToken } from '@/lib/utils/getToken';

export async function getTipoUsuarioById(params: { id: number }): Promise<TipoUsuario> {
    try {
        const tipoUsuario = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_TIPOUSUARIO}/${params.id}`, {
            method: 'GET'
        });

        if (!tipoUsuario.ok) throw new Error(`Error getting tipoUsuario with id ${params.id}: ${tipoUsuario.status} - ${tipoUsuario.statusText}`);

        return await tipoUsuario.json();
    } catch (error) {
        console.error('Get tipoUsuario failed: ', {
            id: params.id,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function getTiposUsuario(): Promise<TipoUsuario[]> {
    try {
        const token = await getToken();

        const tiposUsuario = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_TIPOUSUARIO}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!tiposUsuario.ok) throw new Error(`Error getting tiposUsuario: ${tiposUsuario.status} - ${tiposUsuario.statusText}`);

        return await tiposUsuario.json();
    } catch (error) {
        console.error('get tiposUsuario failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};