'use server'

import CONFIG from '@/config';
import { Usuario } from "@/lib/types/usuario/usuario.entity";

export async function getUsuarioByEmail(params: { email: string }): Promise<Usuario> {
    try {
        const usuarioUrlParams = new URLSearchParams({
            email: params.email
        });

        const usuario = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_LOGIN}?${usuarioUrlParams}`, {
            method: 'GET'
        });

        if (!usuario.ok) {
            throw new Error(`Error getting usuario: ${usuario.status} - ${usuario.statusText}`);
        };

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