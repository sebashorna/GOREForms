import { prisma } from "../../../config/prisma";
import bcrypt from "bcrypt";

class AuthRepository {

    async buscarPorUsuario(usuario: string) {
        return prisma.usuarios.findUnique({
            where: { usuario },
            select: {
                id_usuario: true,
                usuario: true,
                correo: true,
                password_hash: true,
                estado: true,
                intentos_fallidos: true,
                bloqueado_hasta: true,
                rol: true,
            }
        });
    }

    async validarPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async registrarIntentoFallido(id_usuario: number) {
        return prisma.usuarios.update({
            where: { id_usuario },
            data: {
                intentos_fallidos: { increment: 1 },
                bloqueado_hasta: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
            }
        });
    }

    async resetearIntentos(id_usuario: number) {
        return prisma.usuarios.update({
            where: { id_usuario },
            data: {
                intentos_fallidos: 0,
                bloqueado_hasta: null,
                ultimo_login: new Date()
            }
        });
    }

    async crearCodigo2FA(id_usuario: number): Promise<string> {
        // Eliminar códigos anteriores no usados
        await prisma.login_2fa.deleteMany({
            where: {
                id_usuario,
                usado: false,
                expiracion: { lt: new Date() }
            }
        });

        // Generar código de 6 dígitos
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        // Guardar nuevo código (expira en 5 minutos)
        await prisma.login_2fa.create({
            data: {
                id_usuario,
                codigo,
                expiracion: new Date(Date.now() + 5 * 60 * 1000)
            }
        });

        return codigo;
    }

    async verificarCodigo2FA(id_usuario: number, codigo: string) {
        const registro = await prisma.login_2fa.findFirst({
            where: {
                id_usuario,
                codigo,
                usado: false,
                expiracion: { gt: new Date() }
            }
        });

        if (!registro) {
            return null;
        }

        // Marcar como usado
        await prisma.login_2fa.update({
            where: { id: registro.id },
            data: { usado: true }
        });

        return registro;
    }

    async crearSesion(id_usuario: number, token: string, ip: string) {
        return prisma.sesiones.create({
            data: {
                id_usuario,
                token,
                fecha_inicio: new Date(),
                fecha_expira: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
                activo: true,
                ip
            }
        });
    }

    async invalidarSesion(token: string) {
        return prisma.sesiones.updateMany({
            where: { token, activo: true },
            data: { activo: false }
        });
    }

    async registrarAuditoria(
        id_usuario: number | null,
        usuario: string | null,
        ip: string | null,
        exito: boolean,
        motivo: string | null
    ) {
        return prisma.login_auditoria.create({
            data: {
                id_usuario,
                usuario,
                ip,
                exito,
                motivo,
                fecha: new Date()
            }
        });
    }

}

export default new AuthRepository();