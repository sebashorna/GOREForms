import { Request, Response } from "express";

import service from "./dashboard.service";

import { success, fail } from "../../common/responses/apiResponse";

class DashboardController {

    async resumen(req: Request, res: Response) {

        try {

            const data = await service.resumen();

            return success(
                res,
                data,
                "Resumen obtenido correctamente."
            );

        } catch (err) {

            console.error(err);

            return fail(
                res,
                "No fue posible obtener el resumen."
            );

        }

    }
}

export default new DashboardController();