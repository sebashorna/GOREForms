import repository from "./educacion.repository";
import { CrearEducacionDTO } from "./dto/crearEducacion.dto";

class EducacionService {

    async listar() {
        return repository.findAll();
    }

    async crear(data: CrearEducacionDTO) {
        return repository.create(data);
    }

    async obtenerPorId(codModular: number) {
        return repository.findById(codModular);
    }

    async obtenerReporteCompleto(codModular: number) {
        return repository.findUltimoReporteCompleto(codModular);
    }
}

export default new EducacionService();