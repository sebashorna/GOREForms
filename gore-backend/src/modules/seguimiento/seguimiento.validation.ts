import Joi from "joi";

export const crearSeguimientoSchema = Joi.object({
    codigo_cui: Joi.string()
        .max(20)
        .required(),

    estado_general: Joi.string()
        .max(100)
        .allow(null, ""),

    sisgedo: Joi.string()
        .max(100)
        .allow(null, ""),

    detalle_estado_general: Joi.string()
        .allow(null, ""),

    estado_especifico: Joi.string()
        .max(100)
        .allow(null, ""),

    detalle_estado_especifico: Joi.string()
        .allow(null, ""),

    timeline_inversion: Joi.string()
        .allow(null, ""),

    acciones_programadas: Joi.string()
        .allow(null, "")
});