const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const formatFechaDiaSemana = (isoDate: string | Date) => {
    const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
    const diaSemana = DIAS[date.getDay()];
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = String(date.getFullYear()).slice(-2);
    return `${diaSemana} ${dia}-${mes}-${año}`;
};
