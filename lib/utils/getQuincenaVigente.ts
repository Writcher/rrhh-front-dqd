const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function getQuincenaVigente(date: Date = new Date()) {
    const dia = date.getDate();
    let mes = date.getMonth() + 1;
    let año = date.getFullYear();
    let quincena: 1 | 2;

    if (dia === 1) {
        quincena = 2;
        mes -= 1;
        if (mes === 0) {
            mes = 12;
            año -= 1;
        }
    } else if (dia <= 16) {
        quincena = 1;
    } else {
        quincena = 2;
    }

    const desde = quincena === 1 ? 1 : 16;
    const hasta = quincena === 1 ? 15 : new Date(año, mes, 0).getDate();
    const label = `${desde} al ${hasta} de ${MESES[mes - 1]} de ${año}`;

    return { quincena, mes, año, desde, hasta, label };
};
