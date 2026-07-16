import { prisma } from "../../config/prisma";
import { CrearSeguimientoDTO } from "./dto/crear-seguimiento.dto";
import { ActualizarSeguimientoDTO } from "./dto/actualizar-seguimiento.dto";

export class SeguimientoRepository {

  async findAll() {
    return prisma.seguimiento_proyectos.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }

  async findById(id: number) {
    return prisma.seguimiento_proyectos.findUnique({
      where: {
        id,
      },
    });
  }
  
  async create(data: CrearSeguimientoDTO) {

    //console.log("REPOSITORY DATA:", data);

    return prisma.seguimiento_proyectos.create({
        data,
    });
  }

  async update(id: number, data: ActualizarSeguimientoDTO) {

    return prisma.seguimiento_proyectos.update({

        where: {
            id
        },

        data

    });
  }

  async delete(id: number) {
    return prisma.seguimiento_proyectos.delete({
        where: {
            id
        }
    });
  }

}