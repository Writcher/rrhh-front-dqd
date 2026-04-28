interface WithIdAndNombre {
    id: number,
    nombre: string,
};

export const getIdByNombre = <T extends WithIdAndNombre>(items: T[]) => {
    return (nombre: string) => {
        const item = items.find((item) => item.nombre === nombre);
        return item ? item.id : 0
    };
};