const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const formatFechaDiaSemana = (isoDate: string | Date) => {
    let date: Date;

    if (isoDate instanceof Date) {
        date = isoDate;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
        // Date-only string (YYYY-MM-DD): parsear como local, no UTC.
        const [y, m, d] = isoDate.split('-').map(Number);
        date = new Date(y, m - 1, d);
    } else {
        // Strings con hora/timezone: confiar en el parser nativo.
        date = new Date(isoDate);
    }

    const diaSemana = DIAS[date.getDay()];
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = String(date.getFullYear()).slice(-2);
    return `${diaSemana} ${dia}-${mes}-${año}`;
};
