import { Request, Response } from "express";
import { SeguimientoService } from "./seguimiento.service";
import { CrearSeguimientoDTO } from "./dto/crear-seguimiento.dto";
import { crearSeguimientoSchema } from "./seguimiento.validation";
import { success, fail } from "../../common/responses/apiResponse";

const service = new SeguimientoService();

export class SeguimientoController {

    async listar(req: Request, res: Response) {
        try {

            const proyectos = await service.obtenerTodos();

            return res.status(200).json(proyectos);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Error al obtener los proyectos."
            });

        }
    }

    async obtener(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "ID inválido."
                });
            }

            const proyecto = await service.obtenerPorId(id);

            if (!proyecto) {
                return res.status(404).json({
                    message: "Proyecto no encontrado."
                });
            }

            return res.status(200).json(proyecto);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Error interno del servidor."
            });

        }

    }

    async crear(req: Request, res: Response) {
        
    //console.log("BODY:", req.body);

    const { error } = crearSeguimientoSchema.validate(req.body);

    if (error) {
        return fail(res, error.details[0].message, 400);
    }

    try {

        const data: CrearSeguimientoDTO = req.body;

        const proyecto = await service.crear(data);

        return success(
            res,
            proyecto,
            "Proyecto creado correctamente.",
            201
        );

        } catch (err) {

            console.error(err);

            return fail(
                res,
                "No fue posible crear el proyecto."
            );

        }

    }

    

}