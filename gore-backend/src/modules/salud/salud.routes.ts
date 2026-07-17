import { Router } from "express";
import controller from "./salud.controller";

const router = Router();

router.get("/", controller.listar);

router.get("/:id/completo", controller.obtenerCompleto);

router.get("/:id", controller.obtenerPorId);

router.post("/", controller.crear);

export default router;