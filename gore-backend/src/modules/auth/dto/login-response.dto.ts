export class LoginResponseDTO {
    constructor(
        public token: string,
        public usuario: {
            id_usuario: number;
            usuario: string;
            correo: string;
            rol: string;
        },
        public requiere_2fa: boolean = false,
        public id_usuario?: number
    ) {}
}