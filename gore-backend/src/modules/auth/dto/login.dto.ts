export class LoginDTO {
    constructor(
        public usuario: string,
        public password: string,
        public recordar: boolean = false
    ) {}
}
