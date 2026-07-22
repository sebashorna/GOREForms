import { Request, Response } from "express";

import service from "./educacion.service";

import { success, fail } from "../../common/responses/apiResponse";

class EducacionController {

    async crear(req: Request, res: Response) {

        try {

            console.log('POST /api/educacion body:', JSON.stringify(req.body));
            const proyecto = await service.crear(req.body);

            return success(
                res,
                proyecto,
                "Formulario de educación recibido correctamente.",
                201
            );

        } catch (err) {

            console.error('POST /api/educacion error:', err);
            if (err instanceof Error) {
                console.error(err.stack);
            } else {
                console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
            }

            const mensaje = err instanceof Error ? err.message : 'Error desconocido';
            return fail(
                res,
                `No fue posible registrar el formulario. ${mensaje}`
            );

        }

    }

    async listar(req: Request, res: Response) {

        try {

            const instituciones = await service.listar();

            return success(
                res,
                instituciones,
                "Instituciones educativas obtenidas correctamente."
            );

        } catch (error) {

            console.error(error);

            return fail(
                res,
                "No fue posible obtener las instituciones educativas."
            );

        }

    }

    async obtenerPorId(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return fail(res, "El código modular debe ser un número.", 400);
            }

            const institucion = await service.obtenerPorId(id);

            if (!institucion) {
                return fail(res, "Institución educativa no encontrada.", 404);
            }

            return success(
                res,
                institucion,
                "Institución educativa obtenida correctamente."
            );

        } catch (error) {

            console.error(error);

            return fail(
                res,
                "No fue posible obtener la institución educativa."
            );

        }

    }

    async obtenerCompleto(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return fail(res, "El código modular debe ser un número.", 400);
            }

            const reporte = await service.obtenerReporteCompleto(id);

            if (!reporte.institucion) {
                return fail(res, "Institución educativa no encontrada.", 404);
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

export default new EducacionController();
