import { Router } from "express";
import controller from "./historial.controller";

const router = Router();

router.get("/", controller.listar);

export default router;