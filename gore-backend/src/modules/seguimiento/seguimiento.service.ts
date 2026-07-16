import { SeguimientoRepository } from "./seguimiento.repository";
import { CrearSeguimientoDTO } from "./dto/crear-seguimiento.dto";
import { ActualizarSeguimientoDTO } from "./dto/actualizar-seguimiento.dto";

export class SeguimientoService {

    private repository = new SeguimientoRepository();

    async obtenerTodos() {
        return await this.repository.findAll();
    }

    async obtenerPorId(id: number) {
        return await this.repository.findById(id);
    }

    async crear(data: CrearSeguimientoDTO) {
        return await this.repository.create(data);
    }

    async buscarPorId(id: number) {
        return this.repository.findById(id);
    }

    async actualizar(id: number, data: ActualizarSeguimientoDTO) {
        return this.repository.update(id, data);
    }

    async eliminar(id: number) {
        return this.repository.delete(id);
    }
}