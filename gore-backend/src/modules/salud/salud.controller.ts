import { Request, Response } from "express";

import service from "./salud.service";

import { success, fail } from "../../common/responses/apiResponse";

class SaludController {

    async crear(req: Request, res: Response) {

        try {

            const proyecto = await service.crear(req.body);

            return success(
                res,
                proyecto,
                "Formulario de salud recibido correctamente.",
                201
            );

        } catch (err) {

            console.error(err);

            return fail(
                res,
                "No fue posible registrar el formulario."
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
}

export default new SaludController();