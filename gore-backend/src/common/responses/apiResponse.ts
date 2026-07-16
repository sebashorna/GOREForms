import { Response } from "express";

export const success = (
    res: Response,
    data: unknown,
    message = "Operación realizada correctamente.",
    status = 200
) => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};

export const fail = (
    res: Response,
    message = "Ocurrió un error.",
    status = 500
) => {
    return res.status(status).json({
        success: false,
        message,
        data: null
    });
};