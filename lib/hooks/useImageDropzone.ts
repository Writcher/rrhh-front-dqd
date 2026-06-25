import { useState, useCallback } from 'react';
import { FileRejection, useDropzone as useReactDropzone } from 'react-dropzone';

// Variante de useDropzone para fotos (el original acepta solo Excel).
export const useImageDropzone = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        setError(null);

        if (rejectedFiles.length > 0) {
            setError('Solo se permiten imágenes (.jpg, .jpeg, .png)');
            return;
        }

        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useReactDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxFiles: 1,
        multiple: false
    });

    const deleteFile = () => {
        setFile(null);
        setError(null);
    };

    return {
        file,
        error,
        isDragActive,
        deleteFile,
        getRootProps,
        getInputProps
    };
};
