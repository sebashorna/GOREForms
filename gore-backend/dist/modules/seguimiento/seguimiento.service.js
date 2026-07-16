"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeguimientoService = void 0;
const seguimiento_repository_1 = require("./seguimiento.repository");
class SeguimientoService {
    repository = new seguimiento_repository_1.SeguimientoRepository();
    async obtenerTodos() {
        return await this.repository.findAll();
    }
    async obtenerPorId(id) {
        return await this.repository.findById(id);
    }
    async crear(data) {
        return await this.repository.create(data);
    }
}
exports.SeguimientoService = SeguimientoService;
