"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearSeguimientoSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.crearSeguimientoSchema = joi_1.default.object({
    codigo_cui: joi_1.default.string()
        .max(20)
        .required(),
    estado_general: joi_1.default.string()
        .max(100)
        .allow(null, ""),
    sisgedo: joi_1.default.string()
        .max(100)
        .allow(null, ""),
    detalle_estado_general: joi_1.default.string()
        .allow(null, ""),
    estado_especifico: joi_1.default.string()
        .max(100)
        .allow(null, ""),
    detalle_estado_especifico: joi_1.default.string()
        .allow(null, ""),
    timeline_inversion: joi_1.default.string()
        .allow(null, ""),
    acciones_programadas: joi_1.default.string()
        .allow(null, "")
});
