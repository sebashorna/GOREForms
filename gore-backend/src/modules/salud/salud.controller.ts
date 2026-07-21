import { Request, Response } from "express";

import service from "./salud.service";

import { success, fail } from "../../common/responses/apiResponse";

class SaludController {

    async crear(req: Request, res: Response) {

        try {

            console.log('POST /api/salud body:', JSON.stringify(req.body));
            const usuarioId = (req as any).usuario?.id_usuario;
            const proyecto = await service.crear({ ...req.body, id_usuario: usuarioId });

            return success(
                res,
                proyecto,
                "Formulario de salud recibido correctamente.",
                201
            );

        } catch (err) {

            console.error('POST /api/salud error:', err);
            if (err instanceof Error) {
                console.error(err.stack);
            } else {
                console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
            }

            const errorMessage = err instanceof Error ? err.message : "No fue posible registrar el formulario.";

            return fail(
                res,
                `Error: ${errorMessage}`,
                500
            );

        }

    }

    async listar(req: Request, res: Response) {

    try {

        const establecimientos = await service.listar();

        return success(
            res,
            establecimientos,
            "Establecimientos obtenidos correctamente."
        );

    } catch (error) {

        console.error(error);

        return fail(
                res,
                "No fue posible obtener los establecimientos."
            );

        }

    }

    async obtenerPorId(req: Request, res: Response) {
        console.log("Entró a obtenerPorId");
        console.log(req.params.id);
        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {

                return fail(
                    res,
                    "El id_renaes debe ser un número.",
                    400
                );

            }

            const establecimiento = await service.obtenerPorId(id);

            if (!establecimiento) {

                return fail(
                    res,
                    "Establecimiento no encontrado.",
                    404
                );

            }

            return success(
                res,
                establecimiento,
                "Establecimiento obtenido correctamente."
            );

        } catch (error) {

            console.error(error);

            return fail(
                res,
                "No fue posible obtener el establecimiento."
            );

        }

    }

    async obtenerCompleto(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return fail(res, "El id_renaes debe ser un número.", 400);
            }

            const reporte = await service.obtenerReporteCompleto(id);

            if (!reporte.establecimiento) {
                return fail(res, "Establecimiento no encontrado.", 404);
            }

            return success(
                res,
                reporte,
                "Reporte completo obtenido correctamente."
            );

        } catch (error) {

            console.error(error);

            return fail(
                res,
                "No fue posible obtener el reporte completo."
            );

        }

    }
}

export default new SaludController();