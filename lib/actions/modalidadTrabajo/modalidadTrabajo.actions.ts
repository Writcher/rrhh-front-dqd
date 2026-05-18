'use server'

import CONFIG from '@/config';
import { ModalidadTrabajo } from '@/lib/types/modalidadTrabajo/modalidadTrabajo.entity';
import { getToken } from '@/lib/utils/getToken';

export async function getModalidadesTrabajo(): Promise<ModalidadTrabajo[]> {
    try {
        const token = await getToken();

        const modalidadesTrabajo = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_MODALIDADTRABAJO}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!modalidadesTrabajo.ok) throw new Error(`Error getting modalidadesTrabajo: ${modalidadesTrabajo.status} - ${modalidadesTrabajo.statusText}`);

        return await modalidadesTrabajo.json();
    } catch (error) {
        console.error('Get modalidadesTrabajo failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
}; 