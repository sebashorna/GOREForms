import { Router } from "express";
import controller from "../controllers/auth.controller";

const router = Router();

router.post("/login", controller.login);
router.post("/verify-2fa", controller.verify2FA);
router.post("/logout", controller.logout);
router.get("/me", controller.me);

export default router;