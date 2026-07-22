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
                dre: dto.dre,
                ugel: dto.ugel,
                nivel: dto.nivel,
                gestion: dto.gestion,
                provincia: dto.provincia,
                distrito: dto.distrito,
                centro_poblado: dto.centro_poblado,
                fecha_modificacion_educacion: new Date(),
            },
            update: {
                nombre_ie: dto.nombre_ie,
                dre: dto.dre,
                ugel: dto.ugel,
                nivel: dto.nivel,
                gestion: dto.gestion,
                provincia: dto.provincia,
                distrito: dto.distrito,
                centro_poblado: dto.centro_poblado,
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
                estado_infra: dto.estado_infra,
                aulas_buenas: dto.aulas_buenas,
                mobiliario_optimo_porc: dto.mobiliario_optimo_porc,
                computadoras_total: dto.computadoras_total,
                servicio_agua: dto.servicio_agua,
                servicio_desague: dto.servicio_desague,
                servicio_luz: dto.servicio_luz,
                tiene_internet: dto.tiene_internet,
                riesgo_critico: dto.riesgo_critico,
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

        await tx.proyectos_infraestructura.deleteMany({ where: { cod_modular: dto.cod_modular, fecha_corte: dto.fecha_corte } });

        await tx.proyectos_infraestructura.create({
            data: {
                cod_modular: dto.cod_modular,
                cui_proyecto: dto.cui_proyecto,
                estado_proyecto: dto.estado_proyecto,
                avance_fisico: dto.avance_fisico,
                monto_total: dto.monto_total,
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
                total_matricula: dto.total_matricula,
                docentes_requeridos: dto.docentes_requeridos,
                docentes_nombrados: dto.docentes_nombrados,
                docentes_contratados: dto.docentes_contratados,
                personal_administrativo: dto.personal_admin,
                tiene_psicologo: dto.tiene_psicologo,
                fecha_corte: dto.fecha_corte
            }
        });

    }

    private async guardarHistorial(
        tx: Prisma.TransactionClient,
        dto: CrearEducacionDTO
    ) {
        const historialData: any = {
            cod_modular: dto.cod_modular,
            tipo: "educacion",
            referencia: String(dto.cod_modular),
            nombre_usuario: "Sistema",
            fecha_modificacion_historial: new Date(),
        };
        
        await tx.historial.create({
            data: historialData
        });
    }

}

export default new EducacionRepository();