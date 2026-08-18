import { prisma } from "../../config/prisma";

class DashboardRepository {

    async resumen() {

        const [totalSalud, totalEducacion, ultimoSalud, ultimoEducacion] = await Promise.all([
            prisma.proyectos_inversion.count(),
            prisma.proyectos_infraestructura.count(),
            prisma.proyectos_inversion.findFirst({
                orderBy: { fecha_registro_sistema: 'desc' }
            }),
            prisma.proyectos_infraestructura.findFirst({
                orderBy: { fecha_registro_sistema: 'desc' }
            }),
        ]);

        const totalProyectos = totalSalud + totalEducacion;

        let ultimoRegistro = null;

        const fechaSalud = ultimoSalud?.fecha_registro_sistema?.getTime() || 0;
        const fechaEducacion = ultimoEducacion?.fecha_registro_sistema?.getTime() || 0;

        if (ultimoSalud && ultimoEducacion) {
            ultimoRegistro = (fechaSalud > fechaEducacion)
                ? ultimoSalud
                : ultimoEducacion;
        } else {
            ultimoRegistro = ultimoSalud || ultimoEducacion;
        }

        return {
            totalProyectos,
            ultimoRegistro
        };

    }

}

export default new DashboardRepository();