import { Mes } from "../types/mes/mes.entity";

export const getDefaultMesQuincena = (meses: Mes[]): { id_mes: number, quincena: number } | null => {
    if (!meses || meses.length === 0) return null;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const current = meses.find(m => m.id_año === year && m.mes === month);
    const latest = [...meses].sort((a, b) => b.id_año - a.id_año || b.mes - a.mes)[0];
    const mes = current ?? latest;

    return {
        id_mes: mes.id,
        quincena: today.getDate() <= 15 ? 1 : 2
    };
};
