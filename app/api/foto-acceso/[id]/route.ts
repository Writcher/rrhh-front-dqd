import { NextRequest, NextResponse } from 'next/server';
import CONFIG from '@/config';
import { getToken } from '@/lib/utils/getToken';

// Proxy para descargar la foto de un empleado desde el control de acceso.
// Necesario porque la descarga requiere el header Authorization (un <a> directo
// al backend no lo puede mandar). Corre server-side y usa la sesión (getToken).
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = await getToken();

    const res = await fetch(
        `${CONFIG.URL_BASE}${CONFIG.URL_CONTROL_ACCESO}/empleados/${id}/foto`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
        return NextResponse.json(
            { message: 'No se pudo obtener la foto' },
            { status: res.status }
        );
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    return new NextResponse(buffer, {
        headers: {
            'Content-Type': res.headers.get('content-type') ?? 'image/jpeg',
            'Content-Disposition': `attachment; filename="empleado-${id}.jpg"`
        }
    });
};
