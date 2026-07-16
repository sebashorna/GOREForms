import { SeguimientoRepository } from "./seguimiento.repository";
import { CrearSeguimientoDTO } from "./dto/crear-seguimiento.dto";

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

}