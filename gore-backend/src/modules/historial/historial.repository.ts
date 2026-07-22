import { prisma } from "../../config/prisma";

class HistorialRepository {

    async listar(filtros: {
        tipo?: string;
        busqueda?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
        usuario?: string;
    }) {

        const where: any = {};

        // Filtro por tipo
        if (filtros.tipo === 'salud') {
            where.tipo = 'salud';
        } else if (filtros.tipo === 'educacion') {
            where.tipo = 'educacion';
        }

        // Filtro por fecha
        if (filtros.fecha_desde || filtros.fecha_hasta) {
            where.fecha_modificacion_historial = {};
            if (filtros.fecha_desde) {
                where.fecha_modificacion_historial.gte = new Date(filtros.fecha_desde);
            }
            if (filtros.fecha_hasta) {
                const hasta = new Date(filtros.fecha_hasta);
                hasta.setHours(23, 59, 59, 999);
                where.fecha_modificacion_historial.lte = hasta;
            }
        }

        // Filtro por usuario (busca en nombre_usuario)
        if (filtros.usuario) {
            where.nombre_usuario = {
                contains: filtros.usuario,
                mode: 'insensitive'
            };
        }

        const registros = await (prisma.historial.findMany as any)({
            where,
            orderBy: {
                fecha_modificacion_historial: 'desc'
            }
        });

        // Collect references for batch queries
        const educacionRefs = [...new Set(
            registros
                .filter((r: any) => r.tipo === 'educacion')
                .map((r: any) => Number(r.referencia))
                .filter((n: number) => !isNaN(n))
        )] as number[];

        const saludRefs = [...new Set(
            registros
                .filter((r: any) => r.tipo === 'salud')
                .map((r: any) => Number(r.referencia))
                .filter((n: number) => !isNaN(n))
        )] as number[];

        // Batch queries for names
        const educacionMap = new Map<number, string>();
        if (educacionRefs.length > 0) {
            const ies = await prisma.instituciones_educativas.findMany({
                where: { cod_modular: { in: educacionRefs } },
                select: { cod_modular: true, nombre_ie: true }
            });
            ies.forEach((ie: any) => educacionMap.set(ie.cod_modular, ie.nombre_ie));
        }

        const saludMap = new Map<number, string>();
        if (saludRefs.length > 0) {
            const eess = await prisma.establecimientos.findMany({
                where: { id_renaes: { in: saludRefs } },
                select: { id_renaes: true, nombre_eess: true }
            });
            eess.forEach((e: any) => saludMap.set(e.id_renaes, e.nombre_eess));
        }

        // Transformar los resultados
        const resultados = registros.map((r: any) => {
            const tipo = r.tipo === 'salud' ? 'Salud' : 'Educación';
            const refNum = Number(r.referencia);

            let nombre = '—';
            if (r.tipo === 'educacion' && !isNaN(refNum)) {
                nombre = educacionMap.get(refNum) || r.referencia || '—';
            } else if (r.tipo === 'salud' && !isNaN(refNum)) {
                nombre = saludMap.get(refNum) || r.referencia || '—';
            }

            return {
                id_historial: r.id_historial,
                nombre: nombre,
                tipo,
                fecha_modificacion: r.fecha_modificacion_historial,
                usuario: r.nombre_usuario || '—'
            };
        });

        // Filtro de búsqueda por nombre
        if (filtros.busqueda) {
            const term = filtros.busqueda.toLowerCase();
            return resultados.filter((r: any) =>
                r.nombre.toLowerCase().includes(term)
            );
        }

        return resultados;
    }

}

export default new HistorialRepository();
