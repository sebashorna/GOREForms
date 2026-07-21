import { Request, Response } from "express";

import service from "../services/auth.service";

class AuthController {

    async login(req: Request, res: Response) {

        try {

            const { usuario, password, recordar } = req.body;

            const ip = req.ip || req.socket.remoteAddress || null;

            const resultado = await service.login({ usuario, password, recordar }, ip);

            return res.json({ success: true, data: resultado, message: "Login exitoso" });

        } catch (error: any) {

            return res.status(401).json({ success: false, message: error.message || "Error en el login" });

        }

    }

    async verify2FA(req: Request, res: Response) {

        try {

            const { id_usuario, codigo } = req.body;

            const ip = req.ip || req.socket.remoteAddress || null;

            const resultado = await service.verify2FA({ id_usuario, codigo }, ip);

            return res.json({ success: true, data: resultado, message: "Verificación 2FA exitosa" });

        } catch (error: any) {

            return res.status(401).json({ success: false, message: error.message || "Error en la verificación 2FA" });

        }

    }

    async logout(req: Request, res: Response) {

        try {

            const token = req.headers.authorization?.replace("Bearer ", "");

            if (token) {

                await service.logout(token);

            }

            return res.json({ success: true, message: "Logout exitoso" });

        } catch (error: any) {

            return res.json({ success: true, message: "Logout exitoso" });

        }

    }

    async me(req: Request, res: Response) {

        try {

            const usuario = (req as any).user;

            if (!usuario) {

                return res.status(401).json({ success: false, message: "No autenticado" });

            }

            return res.json({ success: true, data: usuario, message: "Usuario autenticado" });

        } catch (error: any) {

            return res.status(401).json({ success: false, message: "No autenticado" });

        }

    }

}

export default new AuthController();