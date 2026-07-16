"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeguimientoRepository = void 0;
const prisma_1 = require("../../config/prisma");
class SeguimientoRepository {
    async findAll() {
        return prisma_1.prisma.seguimiento_proyectos.findMany({
            orderBy: {
                id: "desc",
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.seguimiento_proyectos.findUnique({
            where: {
                id,
            },
        });
    }
    async create(data) {
        return prisma_1.prisma.seguimiento_proyectos.create({
            data,
        });
    }
}
exports.SeguimientoRepository = SeguimientoRepository;
