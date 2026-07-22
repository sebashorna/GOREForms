import jwt from "jsonwebtoken";

import repository from "../repositories/auth.repository";
import { LoginDTO } from "../dto/login.dto";
import { Verify2FADTO } from "../dto/verify-2fa.dto";
import { LoginResponseDTO } from "../dto/login-response.dto";

class AuthService {

    private readonly JWT_SECRET = "gore-secret-key-2026"; // TODO: Mover a .env
    private readonly JWT_EXPIRES = "24h";

    async login(dto: LoginDTO, ip: string | null): Promise<LoginResponseDTO> {
        // Buscar usuario
        const usuario = await repository.buscarPorUsuario(dto.usuario);

        if (!usuario) {
            await repository.registrarAuditoria(null, dto.usuario, ip, false, "Usuario no encontrado");
            throw new Error("Usuario o contraseña incorrectos");
        }

        // Verificar si está bloqueado
        if (usuario.bloqueado_hasta && usuario.bloqueado_hasta > new Date()) {
            await repository.registrarAuditoria(usuario.id_usuario, usuario.usuario, ip, false, "Usuario bloqueado");
            throw new Error("Usuario bloqueado. Intente más tarde");
        }

        // Validar contraseña
        const passwordValida = await repository.validarPassword(dto.password, usuario.password_hash);

        if (!passwordValida) {
            await repository.registrarIntentoFallido(usuario.id_usuario);
            await repository.registrarAuditoria(usuario.id_usuario, usuario.usuario, ip, false, "Contraseña incorrecta");
            throw new Error("Usuario o contraseña incorrectos");
        }

        // Resetear intentos
        await repository.resetearIntentos(usuario.id_usuario);

        // Verificar si requiere 2FA
        const requiere2FA = usuario.rol === 'ADMIN' || usuario.rol === 'SALUD';

        if (requiere2FA) {
            // Generar código 2FA
            const codigo2FA = await repository.crearCodigo2FA(usuario.id_usuario);
            
            // TODO: Enviar código por email/SMS
            console.log(`Código 2FA para ${usuario.usuario}: ${codigo2FA}`);

            await repository.registrarAuditoria(usuario.id_usuario, usuario.usuario, ip, true, "Login exitoso - 2FA requerido");

            return new LoginResponseDTO(
                "", // Sin token hasta verificar 2FA
                {
                    id_usuario: usuario.id_usuario,
                    usuario: usuario.usuario,
                    correo: usuario.correo,
                    rol: usuario.rol || 'HISTORIAL'
                },
                true,
                usuario.id_usuario
            );
        }

        // Login exitoso sin 2FA
        const token = this.generarJWT(usuario);
        
        await repository.registrarAuditoria(usuario.id_usuario, usuario.usuario, ip, true, "Login exitoso");

        return new LoginResponseDTO(
            token,
            {
                id_usuario: usuario.id_usuario,
                usuario: usuario.usuario,
                correo: usuario.correo,
                rol: usuario.rol || 'HISTORIAL'
            },
            false
        );
    }

    async verify2FA(dto: Verify2FADTO, ip: string | null): Promise<LoginResponseDTO> {
        // Verificar código 2FA
        const registro2FA = await repository.verificarCodigo2FA(dto.id_usuario, dto.codigo);

        if (!registro2FA) {
            await repository.registrarAuditoria(dto.id_usuario, null, ip, false, "Código 2FA inválido");
            throw new Error("Código 2FA inválido o expirado");
        }

        // Obtener usuario
        const usuario = await repository.buscarPorUsuario(registro2FA.id_usuario.toString());
        
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        // Generar token
        const token = this.generarJWT(usuario);
        
        await repository.registrarAuditoria(usuario.id_usuario, usuario.usuario, ip, true, "Login 2FA exitoso");

        return new LoginResponseDTO(
            token,
            {
                id_usuario: usuario.id_usuario,
                usuario: usuario.usuario,
                correo: usuario.correo,
                rol: usuario.rol || 'HISTORIAL'
            },
            false
        );
    }

    async logout(token: string) {
        await repository.registrarAuditoria(null, null, null, true, "Logout exitoso");
    }

    private generarJWT(usuario: any): string {
        const payload = {
            id_usuario: usuario.id_usuario,
            usuario: usuario.usuario,
            rol: usuario.rol || 'HISTORIAL'
        };

        return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES });
    }

}

export default new AuthService();