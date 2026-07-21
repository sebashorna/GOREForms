import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Token no proporcionado"

            });

        }

        const decoded = jwt.verify(token, "gore-secret-key-2026") as any;

        (req as any).user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({

            success: false,

            message: "Token inválido o expirado"

        });

    }

};