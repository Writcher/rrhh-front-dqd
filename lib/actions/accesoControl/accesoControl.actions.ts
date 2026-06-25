'use server';

import CONFIG from '@/config';
import { getToken } from '@/lib/utils/getToken';

// Carga la foto de un empleado en el control de acceso. Si no estaba
// sincronizado, lo crea con acceso a todas las obras; si ya estaba, actualiza
// la foto. (Backend: POST /api/control-acceso/empleados/:id/foto, multipart)
export async function cargarFotoAcceso(params: { id: number; file: File }) {
    try {
        const token = await getToken();

        const formData = new FormData();
        formData.append('foto', params.file);

        const respuesta = await fetch(
            `${CONFIG.URL_BASE}${CONFIG.URL_CONTROL_ACCESO}/empleados/${params.id}/foto`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!respuesta.ok) {
            const body = await respuesta.json().catch(() => null);
            throw new Error(body?.error || `Error cargando foto: ${respuesta.status} - ${respuesta.statusText}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error('cargarFotoAcceso failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};
