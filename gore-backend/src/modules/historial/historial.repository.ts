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

        // Filtro por tipo: si es "salud" solo trae los que tienen id_renaes != 0
        // si es "educacion" solo trae los que tienen cod_modular != 0
        if (filtros.tipo === 'salud') {
            where.id_renaes = { not: 0 };
        } else if (filtros.tipo === 'educacion') {
            where.cod_modular = { not: 0 };
        }

        // Búsqueda por nombre se hace después de obtener los datos
        // porque depende de las relaciones

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

        const registros = await prisma.historial.findMany({
            where,
            include: {
                establecimientos: {
                    select: { nombre_eess: true }
                },
                instituciones_educativas: {
                    select: { nombre_ie: true }
                },
                usuarios: {
                    select: { usuario: true }
                }
            },
            orderBy: {
                fecha_modificacion_historial: 'desc'
            }
        });

        // Transformar los resultados
        let resultados = registros.map(r => {
            const nombre = r.id_renaes !== 0
                ? r.establecimientos?.nombre_eess
                : r.instituciones_educativas?.nombre_ie;

            const tipo = r.id_renaes !== 0 ? 'Salud' : 'Educación';

            return {
                id_historial: r.id_historial,
                nombre: nombre || '—',
                tipo,
                fecha_modificacion: r.fecha_modificacion_historial,
                usuario: r.usuarios?.usuario || '—'
            };
        });

        // Filtro de búsqueda por nombre (post-query porque viene de relaciones)
        if (filtros.busqueda) {
            const term = filtros.busqueda.toLowerCase();
            resultados = resultados.filter(r =>
                r.nombre.toLowerCase().includes(term)
            );
        }

        return resultados;
    }

}

export default new HistorialRepository();