'use server'

import CONFIG from '@/config'
import { getToken } from "@/lib/utils/getToken";

export async function exportAsistencia(params: { id_proyecto: number | '', fecha: string }): Promise<Blob> {
    try {
        const token = await getToken();

        const asistenciaUrlParams = new URLSearchParams({
            id_proyecto: params.id_proyecto.toString(),
            fecha: params.fecha,
        });

        const asistencia = await fetch (`${CONFIG.URL_BASE}${CONFIG.URL_EXPORTAR}/asistencia?${asistenciaUrlParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!asistencia.ok) throw new Error(`Error exporting asistencia: ${asistencia.status} - ${asistencia.statusText}`);

        return await asistencia.blob();
    } catch (error) {
        console.error('Export asistencia failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};

export async function exportResumen(params: { proyectos: number[], id_mes: number | '', quincena: number | '', id_tipoempleado: number | '' }): Promise<Blob> {
    try {
        const token = await getToken();

        const resumenParams: Record<string, string> = {
            id_mes: params.id_mes.toString(),
        };

        if (params.id_tipoempleado !== '' && params.id_tipoempleado !== 0) resumenParams.id_tipoempleado = params.id_tipoempleado.toString();
        if (params.quincena !== '' && params.quincena !== 0) resumenParams.quincena = params.quincena.toString();

        const resumenUrlParams = new URLSearchParams(resumenParams);

        params.proyectos.forEach(id => resumenUrlParams.append('ids_proyecto', id.toString()));

        const resumen = await fetch(`${CONFIG.URL_BASE}${CONFIG.URL_EXPORTAR}/resumen?${resumenUrlParams}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!resumen.ok) throw new Error(`Error exporting resumen: ${resumen.status} - ${resumen.statusText}`);

        return await resumen.blob()
    } catch (error) {
        console.error('Export resumen failed: ', {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        throw error;
    };
};