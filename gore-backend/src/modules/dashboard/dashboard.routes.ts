import { Router } from "express";

import controller from "./dashboard.controller";

const router = Router();

router.get("/resumen", controller.resumen);

export default router;