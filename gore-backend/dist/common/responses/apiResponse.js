"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.success = void 0;
const success = (res, data, message = "Operación realizada correctamente.", status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};
exports.success = success;
const fail = (res, message = "Ocurrió un error.", status = 500) => {
    return res.status(status).json({
        success: false,
        message,
        data: null
    });
};
exports.fail = fail;
