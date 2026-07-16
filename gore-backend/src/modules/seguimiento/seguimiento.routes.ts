import { Router } from "express";
import { SeguimientoController } from "./seguimiento.controller";

const router = Router();

const controller = new SeguimientoController();

router.get("/", controller.listar);

router.get("/:id", controller.buscarPorId);

router.get("/:id", controller.obtener);

router.post("/", controller.crear);

router.put("/:id", controller.actualizar);

export default router;