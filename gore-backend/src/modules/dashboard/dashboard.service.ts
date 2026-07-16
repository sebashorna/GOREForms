import repository from "./dashboard.repository";

class DashboardService {

    async resumen() {

        return repository.resumen();

    }

}

export default new DashboardService();