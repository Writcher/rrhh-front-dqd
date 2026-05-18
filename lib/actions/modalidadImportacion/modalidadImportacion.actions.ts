'use server'

import CONFIG from '@/config';
import { ModalidadImportacion } from '@/lib/types/modalidadImportacion/modalidadImportacion.entity';
import { getToken } from '@/lib/utils/getToken';

export async function getModalidadesImportacion(): Promise<ModalidadImportacion[]> {
    try {
        const token = await getToken();

        const modalidadesImportacion = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_MODALIDADIMPORTACION}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!modalidadesImportacion.ok) throw new Error(`Error getting modalidadesImportacion: ${modalidadesImportacion.status} - ${modalidadesImportacion.statusText}`);

        return await modalidadesImportacion.json();
    } catch (error) {
        console.error('Get modalidadesImportacion failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
}; 