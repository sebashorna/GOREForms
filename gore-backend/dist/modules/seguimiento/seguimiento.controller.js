"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeguimientoController = void 0;
const seguimiento_service_1 = require("./seguimiento.service");
const seguimiento_validation_1 = require("./seguimiento.validation");
const apiResponse_1 = require("../../common/responses/apiResponse");
const service = new seguimiento_service_1.SeguimientoService();
class SeguimientoController {
    async listar(req, res) {
        try {
            const proyectos = await service.obtenerTodos();
            return res.status(200).json(proyectos);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Error al obtener los proyectos."
            });
        }
    }
    async obtener(req, res) {
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
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Error interno del servidor."
            });
        }
    }
    async crear(req, res) {
        const { error } = seguimiento_validation_1.crearSeguimientoSchema.validate(req.body);
        if (error) {
            return (0, apiResponse_1.fail)(res, error.details[0].message, 400);
        }
        try {
            const data = req.body;
            const proyecto = await service.crear(data);
            return (0, apiResponse_1.success)(res, proyecto, "Proyecto creado correctamente.", 201);
        }
        catch (err) {
            console.error(err);
            return (0, apiResponse_1.fail)(res, "No fue posible crear el proyecto.");
        }
    }
}
exports.SeguimientoController = SeguimientoController;
