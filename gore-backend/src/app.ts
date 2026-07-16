import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import seguimientoRoutes from "./modules/seguimiento/seguimiento.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";


const app = express();

/* ===========================
   Middlewares
=========================== */

app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:4200",
        credentials: true,
    })
);

app.use(compression());

app.use(express.json());

app.use(cookieParser());

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

app.use("/api/seguimiento", seguimientoRoutes);

app.use("/api/dashboard", dashboardRoutes);

export default app;