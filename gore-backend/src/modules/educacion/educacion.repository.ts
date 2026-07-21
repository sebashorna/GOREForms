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
                total_estudiantes: dto.total_matricula,
                fecha_modificacion_educacion: new Date(),
            },
            update: {
                nombre_ie: dto.nombre_ie,
                nivel: dto.nivel,
                provincia: dto.provincia,
                distrito: dto.distrito,
                total_estudiantes: dto.total_matricula,
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
                tiene_laboratorio: false,
                fecha_corte: dto.fecha_corte
            }
        });

    }

    private async guardarProyecto(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {

        if (!dto.cui_proyecto || dto.cui_proyecto.trim() === '') {
            return;
        }

        const idProyecto = parseInt(dto.cui_proyecto) || 0;

        await tx.proyectos_infraestructura.upsert({
            where: {
                id_proyecto: idProyecto
            },
            create: {
                id_proyecto: idProyecto,
                cod_modular: dto.cod_modular,
                estado_proyecto: dto.estado_proyecto,
                tipo_obra: "",
                unidad_ejecutora: "",
                avance_fisico: dto.avance_fisico,
                avance_financiero: dto.avance_fisico,
                monto_total: dto.monto_total,
                monto_devengado: dto.monto_total,
                fecha_corte: dto.fecha_corte
            },
            update: {
                estado_proyecto: dto.estado_proyecto,
                avance_fisico: dto.avance_fisico,
                avance_financiero: dto.avance_fisico,
                monto_total: dto.monto_total,
                monto_devengado: dto.monto_total,
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
                docentes_asignados: dto.docentes_nombrados + dto.docentes_contratados,
                personal_administrativo: dto.personal_admin,
                fecha_corte: dto.fecha_corte
            }
        });

    }

    private async guardarHistorial(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {
        const historialData: any = {
            tipo: "educacion",
            referencia: dto.nombre_ie,
            nombre_usuario: dto.nombre_usuario,
            fecha_modificacion_historial: new Date()
        };

        await tx.historial.create({
            data: historialData
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
                servicio_electricidad: dto.servicio_luz,
                estado_critico_infra: dto.riesgo_critico,
                fecha_corte: dto.fecha_corte
            }
        });

    }

}

export default new EducacionRepository();