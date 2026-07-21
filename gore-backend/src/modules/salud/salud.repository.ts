import { prisma } from "../../config/prisma";
import { CrearSaludDTO } from "./dto/crearSalud.dto";
import { Prisma } from "@prisma/client";

class SaludRepository {

    async findAll() {
        return prisma.establecimientos.findMany({
            orderBy: {
                nombre_eess: "asc"
            }
        });
    }

    async findById(idRenaes: number) {
        return prisma.establecimientos.findUnique({
            where: {
                id_renaes: idRenaes
            }
        });
    }

    async findUltimoReporteCompleto(idRenaes: number) {
        const [
            establecimiento,
            equipamiento,
            recursosHumanos,
            epidemiologia,
            servicios,
            condiciones,
            proyecto,
        ] = await Promise.all([
            prisma.establecimientos.findUnique({ where: { id_renaes: idRenaes } }),

            prisma.equipamiento_estado.findFirst({
                where: { id_renaes: idRenaes },
                orderBy: { fecha_corte: 'desc' },
            }),

            prisma.recursos_humanos.findFirst({
                where: { id_renaes: idRenaes },
                orderBy: { fecha_corte: 'desc' },
            }),

            prisma.epidemiologia.findFirst({
                where: { id_renaes: idRenaes },
                orderBy: { fecha_corte: 'desc' },
            }),

            prisma.servicios.findFirst({
                where: { id_renaes: idRenaes },
                orderBy: { fecha_corte: 'desc' },
            }),

            prisma.condiciones_basicas.findFirst({
                where: { id_renaes: idRenaes },
                orderBy: { fecha_corte: 'desc' },
            }),

            prisma.proyectos_inversion.findFirst({
                where: { id_renaes: idRenaes },
                orderBy: { fecha_corte: 'desc' },
            }),
        ]);

        return {
            establecimiento,
            equipamiento,
            recursosHumanos: recursosHumanos,
            epidemiologia,
            servicios,
            condiciones_basicas: condiciones,
            proyecto,
        };
    }

    async create(dto: CrearSaludDTO) {

        return prisma.$transaction(async (tx) => {

            await this.actualizarEstablecimiento(tx, dto);

            await this.guardarProyecto(tx, dto);

            await this.guardarEquipamiento(tx, dto);

            await this.guardarRecursosHumanos(tx, dto);

            await this.guardarEpidemiologia(tx, dto);

            await this.guardarServicios(tx, dto);

            await this.guardarCondiciones(tx, dto);

            await this.guardarHistorial(tx, dto);

            return {

                success: true,
                message: "Reporte registrado correctamente."

            };

        });

    }

    private async actualizarEstablecimiento(

        tx: Prisma.TransactionClient,

        dto: CrearSaludDTO

    ) {

        await tx.establecimientos.upsert({
            where: {
                id_renaes: dto.id_renaes,
            },
            create: {
                id_renaes: dto.id_renaes,
                nombre_eess: dto.nombre_eess,
                categoria: dto.categoria,
                red_salud: dto.red_salud,
                microred: dto.microred,
                ubigeo: 0,
                coord_lat: dto.coord_lat,
                coord_long: dto.coord_long,
                poblacion_asignada: dto.poblacion_asignada,
                tipo: dto.tipo,
                provincia: dto.provincia,
                distrito: dto.distrito,
                fecha_modificacion_salud: new Date(),
            },
            update: {
                nombre_eess: dto.nombre_eess,
                categoria: dto.categoria,
                red_salud: dto.red_salud,
                microred: dto.microred,
                coord_lat: dto.coord_lat,
                coord_long: dto.coord_long,
                poblacion_asignada: dto.poblacion_asignada,
                tipo: dto.tipo,
                provincia: dto.provincia,
                distrito: dto.distrito,
                fecha_modificacion_salud: new Date(),
            },
        });

    }

    private async guardarEquipamiento(

        tx: Prisma.TransactionClient,

        dto: CrearSaludDTO

    ) {

        // eliminar registros anteriores para la misma combinación id_renaes + fecha_corte
        await tx.equipamiento_estado.deleteMany({ where: { id_renaes: dto.id_renaes, fecha_corte: dto.fecha_corte } });

        await tx.equipamiento_estado.create({

            data: {

                id_renaes: dto.id_renaes,

                camas_uci_tot: dto.camas_uci_tot,

                camas_uci_disp: dto.camas_uci_disp,

                camas_hospitalarias: dto.camas_hospitalarias,

                equipo_rayos_x: dto.equipo_rayos_x,

                planta_oxigeno: dto.planta_oxigeno,

                estado_infra: dto.estado_infra,

                ventiladores: dto.ventiladores,

                monitores: dto.monitores,

                ecografo: dto.ecografo,

                tomografo: dto.tomografo,

                operativo: dto.operativo,

                inoperativo: dto.inoperativo,

                fecha_corte: dto.fecha_corte

            }

        });

    }

    private async guardarProyecto(

        tx: Prisma.TransactionClient,

        dto: CrearSaludDTO

    ) {

        if (!dto.id_proyecto || dto.id_proyecto <= 0) {
            return;
        }

        await tx.proyectos_inversion.upsert({
            where: {
                id_proyecto: dto.id_proyecto
            },
            create: {
                id_proyecto: dto.id_proyecto,
                id_renaes: dto.id_renaes,
                estado_inversion: dto.estado_inversion,
                avance_fisico: dto.avance_fisico,
                avance_financiero: dto.avance_financiero,
                monto_total: dto.monto_total,
                monto_devengado: dto.monto_devengado,
                unidad_ejecutora: dto.unidad_ejecutora,
                fecha_corte: dto.fecha_corte
            },
            update: {
                estado_inversion: dto.estado_inversion,
                avance_fisico: dto.avance_fisico,
                avance_financiero: dto.avance_financiero,
                monto_total: dto.monto_total,
                monto_devengado: dto.monto_devengado,
                unidad_ejecutora: dto.unidad_ejecutora,
                fecha_corte: dto.fecha_corte
            }
        });

    }

    private async guardarRecursosHumanos(

        tx: Prisma.TransactionClient,

        dto: CrearSaludDTO

    ) {

        // eliminar recursos humanos previos para la misma fecha e id
        await tx.recursos_humanos.deleteMany({ where: { id_renaes: dto.id_renaes, fecha_corte: dto.fecha_corte } });

        await tx.recursos_humanos.create({

            data: {

                id_renaes: dto.id_renaes,

                med_prog: dto.med_prog,

                med_exist: dto.med_exist,

                turno_24h: dto.turno_24h,

                enfermeras: dto.enfermeras,

                tecnicos: dto.tecnicos,

                pediatra: dto.pediatra,

                gineco_obstetra: dto.gineco_obstetra,

                anestesiologo: dto.anestesiologo,

                cirujano_general: dto.cirujano_general,

                intensivista: dto.intensivista,

                internista: dto.internista,

                cardiologo: dto.cardiologo,

                traumatologo: dto.traumatologo,

                otros_especialistas: dto.otros_especialistas,

                fecha_corte: dto.fecha_corte

            }

        });

    }

    private async guardarServicios(

        tx: Prisma.TransactionClient,

        dto: CrearSaludDTO

    ) {

        await tx.servicios.upsert({
            where: { id_servicios: dto.id_renaes },
            create: {
                id_servicios: dto.id_renaes,
                id_renaes: dto.id_renaes,
                emergencia: dto.emergencia,
                uci: dto.uci,
                centro_quirurgico: dto.centro_quirurgico,
                partos: dto.partos,
                consultas_diarias_prom: dto.consultas_diarias_prom,
                camas_ocupadas: dto.camas_ocupadas,
                fecha_corte: dto.fecha_corte,
            },
            update: {
                id_servicios: dto.id_renaes,
                emergencia: dto.emergencia,
                uci: dto.uci,
                centro_quirurgico: dto.centro_quirurgico,
                partos: dto.partos,
                consultas_diarias_prom: dto.consultas_diarias_prom,
                camas_ocupadas: dto.camas_ocupadas,
                fecha_corte: dto.fecha_corte,
            },
        });

    }

    private async guardarCondiciones(

        tx: Prisma.TransactionClient,

        dto: CrearSaludDTO

    ) {

        await tx.condiciones_basicas.upsert({
            where: { id_condiciones: dto.id_renaes },
            create: {
                id_condiciones: dto.id_renaes,
                id_renaes: dto.id_renaes,
                agua: dto.agua,
                desague: dto.desague,
                electricidad: dto.electricidad,
                oxigeno: dto.oxigeno,
                internet: dto.internet,
                fecha_corte: dto.fecha_corte,
            },
            update: {
                id_condiciones: dto.id_renaes,
                id_renaes: dto.id_renaes,
                agua: dto.agua,
                desague: dto.desague,
                electricidad: dto.electricidad,
                oxigeno: dto.oxigeno,
                internet: dto.internet,
                fecha_corte: dto.fecha_corte,
            },
        });

    }
    private async guardarHistorial(
        tx: Prisma.TransactionClient,
        dto: CrearSaludDTO
    ) {
        const historialData: any = {
            tipo: "salud",
            referencia: dto.nombre_eess,
            nombre_usuario: dto.nombre_usuario,
            fecha_modificacion_historial: new Date()
        };

        await tx.historial.create({
            data: historialData
        });
    }

    private async guardarEpidemiologia(

        tx: Prisma.TransactionClient,

        dto: CrearSaludDTO

    ) {

        // eliminar epidemiologia previa para la misma fecha e id
        await tx.epidemiologia.deleteMany({ where: { id_renaes: dto.id_renaes, fecha_corte: dto.fecha_corte } });

        await tx.epidemiologia.create({

            data: {

                id_renaes: dto.id_renaes,

                anho_epi: dto.anho_epi,

                semana_epi: dto.semana_epi,

                casos_dengue: dto.casos_dengue,

                casos_anemia: dto.casos_anemia,

                mort_materna: dto.mort_materna,

                casos_desnutricion: dto.casos_desnutricion,

                iras_edas: dto.iras_edas,

                mortalidad_neonatal: dto.mortalidad_neonatal,

                fecha_corte: dto.fecha_corte

            }

        });

    }


}

export default new SaludRepository();