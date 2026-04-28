export const getDay = (fecha: string | Date) => {
    const date = fecha instanceof Date ? fecha : new Date(fecha);
    const day = date.getDay();
    return day;
};