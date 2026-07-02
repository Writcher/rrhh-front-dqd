// Normaliza cualquier imagen a JPEG (y la achica si es muy grande) usando canvas.
// HikCentral exige JPEG con cara detectable y tamaño acotado; esto evita
// rechazos por formato (PNG, etc.) o por resolución excesiva.
export function imageToJpeg(file: File, maxDim = 1280, quality = 0.92): Promise<File> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            const max = Math.max(width, height);
            if (max > maxDim) {
                const scale = maxDim / max;
                width = Math.round(width * scale);
                height = Math.round(height * scale);
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('No se pudo procesar la imagen'));
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => blob
                    ? resolve(new File([blob], 'foto.jpg', { type: 'image/jpeg' }))
                    : reject(new Error('No se pudo procesar la imagen')),
                'image/jpeg',
                quality
            );
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')); };
        img.src = url;
    });
}
