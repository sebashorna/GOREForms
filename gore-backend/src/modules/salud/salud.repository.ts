import { prisma } from "../../config/prisma";
import { CrearSaludDTO } from "./dto/crearSalud.dto";

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

    async create(data: CrearSaludDTO) {

        return prisma.$transaction(async (tx) => {

            // Aquí irá el guardado del formulario completo

            return {
                mensaje: "Transacción iniciada",
                data
            };

        });

    }

}

export default new SaludRepository();