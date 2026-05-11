interface WithIdAndNombre {
    id: number,
    nombre: string,
};

export const getNombreById = <T extends WithIdAndNombre>(items: T[]) => {
    return (id: number) => {
        if (!id) return '';
        const item = items.find((item) => item.id === Number(id));
        return item ? item.nombre : 'Desconocido'
    };
};