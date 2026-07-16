import { prisma } from "../../config/prisma";

class DashboardRepository {

    async resumen() {

        const totalProyectos = await prisma.seguimiento_proyectos.count();

        const ultimoRegistro = await prisma.seguimiento_proyectos.findFirst({

            orderBy: {
                id: "desc"
            }

        });

        return {

            totalProyectos,

            ultimoRegistro

        };

    }

}

export default new DashboardRepository();