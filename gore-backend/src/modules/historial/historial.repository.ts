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

        // Filtro por usuario
        if (filtros.usuario) {
            where.usuarios = {
                usuario: { contains: filtros.usuario, mode: 'insensitive' }
            };
        }

        const registros = await (prisma.historial.findMany as any)({
            where,
            include: {
                establecimientos: {
                    select: { nombre_eess: true }
                },
                instituciones_educativas: {
                    select: { nombre_ie: true }
                }
            },
            orderBy: {
                fecha_modificacion_historial: 'desc'
            }
        });

        // Transformar los resultados
        const resultados = registros.map((r: any) => {
            const historial = r as any;
            const tipo = r.tipo === 'salud' ? 'Salud' : 'Educación';
            
            // Obtener el nombre según el tipo
            let nombre = historial.referencia || '—';
            if (r.tipo === 'salud' && r.establecimientos?.nombre_eess) {
                nombre = r.establecimientos.nombre_eess;
            } else if (r.tipo === 'educacion' && r.instituciones_educativas?.nombre_ie) {
                nombre = r.instituciones_educativas.nombre_ie;
            }

            return {
                id_historial: r.id_historial,
                nombre: nombre,
                tipo,
                fecha_modificacion: r.fecha_modificacion_historial,
                usuario: historial.nombre_usuario || '—'
            };
        });

        // Filtro de búsqueda por nombre (post-query porque viene de relaciones)
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
