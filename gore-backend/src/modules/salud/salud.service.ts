import repository from "./salud.repository";
import { CrearSaludDTO } from "./dto/crearSalud.dto";

class SaludService {

    async listar() {
        return repository.findAll();
    }

    async crear(data: CrearSaludDTO) {
        return repository.create(data);
    }

    async obtenerPorId(idRenaes: number) {

        return repository.findById(idRenaes);

    }
}

export default new SaludService();