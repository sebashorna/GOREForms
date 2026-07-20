import { Request, Response } from "express";

import service from "./historial.service";

import { success, fail } from "../../common/responses/apiResponse";

class HistorialController {

    async listar(req: Request, res: Response) {

        try {

            const {
                tipo,
                busqueda,
                fecha_desde,
                fecha_hasta,
                usuario
            } = req.query;

            const filtros: any = {};

            if (tipo && (tipo === 'salud' || tipo === 'educacion')) {
                filtros.tipo = tipo;
            }
            if (busqueda && typeof busqueda === 'string') {
                filtros.busqueda = busqueda;
            }
            if (fecha_desde && typeof fecha_desde === 'string') {
                filtros.fecha_desde = fecha_desde;
            }
            if (fecha_hasta && typeof fecha_hasta === 'string') {
                filtros.fecha_hasta = fecha_hasta;
            }
            if (usuario && typeof usuario === 'string') {
                filtros.usuario = usuario;
            }

            const historial = await service.listar(filtros);

            return success(
                res,
                historial,
                "Historial obtenido correctamente."
            );

        } catch (error) {

            console.error(error);

            return fail(
                res,
                "No fue posible obtener el historial."
            );

        }

    }

}

export default new HistorialController();