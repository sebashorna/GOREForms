import repository from "./historial.repository";

class HistorialService {

    async listar(filtros: {
        tipo?: string;
        busqueda?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
        usuario?: string;
    }) {
        return repository.listar(filtros);
    }

}

export default new HistorialService();