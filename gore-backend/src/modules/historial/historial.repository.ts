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

        const registros = await prisma.historial.findMany({
            where,
            orderBy: {
                fecha_modificacion_historial: 'desc'
            }
        });

        // Transformar los resultados
        const resultados = registros.map(r => {
            const nombre = r.referencia || '—';
            const tipo = r.tipo === 'salud' ? 'Salud' : 'Educación';

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
            return resultados.filter(r =>
                r.nombre.toLowerCase().includes(term)
            );
        }

        return resultados;
    }

}

export default new HistorialRepository();
