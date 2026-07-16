"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const seguimiento_routes_1 = __importDefault(require("./modules/seguimiento/seguimiento.routes"));
const app = (0, express_1.default)();
/* ===========================
   Middlewares
=========================== */
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:4200",
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
/* ===========================
   Rutas
=========================== */
app.get("/", (_, res) => {
    res.json({
        proyecto: "Sistema GORE",
        version: "1.0.0",
        estado: "Activo",
    });
});
app.use("/api/seguimiento", seguimiento_routes_1.default);
exports.default = app;
