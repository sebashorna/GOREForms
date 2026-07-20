import { prisma } from "../../config/prisma";
import { CrearEducacionDTO } from "./dto/crearEducacion.dto";
import { Prisma } from "@prisma/client";

class EducacionRepository {

    async findAll() {
        return prisma.instituciones_educativas.findMany({
            orderBy: {
                nombre_ie: "asc"
            }
        });
    }

    async findById(codModular: number) {
        return prisma.instituciones_educativas.findUnique({
            where: {
                cod_modular: codModular
            }
        });
    }

    async findUltimoReporteCompleto(codModular: number) {
        const [
            institucion,
            equipamiento,
            recursosHumanos,
            condiciones,
            proyecto,
        ] = await Promise.all([
            prisma.instituciones_educativas.findUnique({ where: { cod_modular: codModular } }),

            prisma.equipamiento.findFirst({
                where: { cod_modular: codModular },
                orderBy: { fecha_corte: 'desc' },
            }),

            prisma.educacion_gore_recursos_humanos.findFirst({
                where: { cod_modular: codModular },
                orderBy: { fecha_corte: 'desc' },
            }),

            prisma.educacion_gore_condiciones_basicas.findFirst({
                where: { cod_modular: codModular },
                orderBy: { fecha_corte: 'desc' },
            }),

            prisma.proyectos_infraestructura.findFirst({
                where: { cod_modular: codModular },
                orderBy: { fecha_corte: 'desc' },
            }),
        ]);

        return {
            institucion,
            equipamiento,
            recursos_humanos: recursosHumanos,
            condiciones_basicas: condiciones,
            proyecto,
        };
    }

    async create(dto: CrearEducacionDTO) {

        return prisma.$transaction(async (tx) => {

            await this.actualizarInstitucion(tx, dto);

            await this.guardarProyecto(tx, dto);

            await this.guardarEquipamiento(tx, dto);

            await this.guardarRecursosHumanos(tx, dto);

            await this.guardarCondiciones(tx, dto);

            await this.guardarHistorial(tx, dto);

            return {
                success: true,
                message: "Reporte registrado correctamente."
            };

        });

    }

    private async actualizarInstitucion(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {

        await tx.instituciones_educativas.upsert({
            where: {
                cod_modular: dto.cod_modular,
            },
            create: {
                cod_modular: dto.cod_modular,
                nombre_ie: dto.nombre_ie,
                nivel: dto.nivel,
                provincia: dto.provincia,
                distrito: dto.distrito,
                coord_lat: dto.coord_lat,
                coord_long: dto.coord_long,
                total_estudiantes: dto.total_estudiantes,
                fecha_modificacion_educacion: new Date(),
            },
            update: {
                nombre_ie: dto.nombre_ie,
                nivel: dto.nivel,
                provincia: dto.provincia,
                distrito: dto.distrito,
                coord_lat: dto.coord_lat,
                coord_long: dto.coord_long,
                total_estudiantes: dto.total_estudiantes,
                fecha_modificacion_educacion: new Date(),
            },
        });

    }

    private async guardarEquipamiento(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {

        await tx.equipamiento.deleteMany({ where: { cod_modular: dto.cod_modular, fecha_corte: dto.fecha_corte } });

        await tx.equipamiento.create({
            data: {
                cod_modular: dto.cod_modular,
                mobiliario_optimo_porc: dto.mobiliario_optimo_porc,
                computadoras_total: dto.computadoras_total,
                tiene_internet: dto.tiene_internet,
                tiene_laboratorio: dto.tiene_laboratorio,
                fecha_corte: dto.fecha_corte
            }
        });

    }

    private async guardarProyecto(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {

        if (!dto.id_proyecto || dto.id_proyecto <= 0) {
            return;
        }

        await tx.proyectos_infraestructura.upsert({
            where: {
                id_proyecto: dto.id_proyecto
            },
            create: {
                id_proyecto: dto.id_proyecto,
                cod_modular: dto.cod_modular,
                estado_proyecto: dto.estado_proyecto,
                tipo_obra: dto.tipo_obra,
                unidad_ejecutora: dto.unidad_ejecutora,
                avance_fisico: dto.avance_fisico,
                avance_financiero: dto.avance_financiero,
                monto_total: dto.monto_total,
                monto_devengado: dto.monto_devengado,
                fecha_corte: dto.fecha_corte
            },
            update: {
                estado_proyecto: dto.estado_proyecto,
                tipo_obra: dto.tipo_obra,
                unidad_ejecutora: dto.unidad_ejecutora,
                avance_fisico: dto.avance_fisico,
                avance_financiero: dto.avance_financiero,
                monto_total: dto.monto_total,
                monto_devengado: dto.monto_devengado,
                fecha_corte: dto.fecha_corte
            }
        });

    }

    private async guardarRecursosHumanos(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {

        await tx.educacion_gore_recursos_humanos.deleteMany({ where: { cod_modular: dto.cod_modular, fecha_corte: dto.fecha_corte } });

        await tx.educacion_gore_recursos_humanos.create({
            data: {
                cod_modular: dto.cod_modular,
                docentes_requeridos: dto.docentes_requeridos,
                docentes_asignados: dto.docentes_asignados,
                personal_administrativo: dto.personal_administrativo,
                fecha_corte: dto.fecha_corte
            }
        });

    }

    private async guardarHistorial(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {
        await tx.historial.create({
            data: {
                id_renaes: null,
                cod_modular: dto.cod_modular,
                tipo: "educacion",
                fecha_modificacion_historial: new Date(),
                id_usuario: 1, // temporal, se reemplazará con el usuario autenticado
            }
        });
    }

    private async guardarCondiciones(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {

        await tx.educacion_gore_condiciones_basicas.deleteMany({ where: { cod_modular: dto.cod_modular, fecha_corte: dto.fecha_corte } });

        await tx.educacion_gore_condiciones_basicas.create({
            data: {
                cod_modular: dto.cod_modular,
                servicio_agua: dto.servicio_agua,
                servicio_desague: dto.servicio_desague,
                servicio_electricidad: dto.servicio_electricidad,
                estado_critico_infra: dto.estado_critico_infra,
                fecha_corte: dto.fecha_corte
            }
        });

    }

}

export default new EducacionRepository();
