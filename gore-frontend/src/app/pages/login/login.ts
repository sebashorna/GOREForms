import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  usuario: string = '';
  password: string = '';
  mostrarPassword: boolean = false;
  recordar: boolean = false;
  cargando: boolean = false;
  error: string = '';

  // 2FA
  mostrar2FA: boolean = false;
  codigo2FA: string = '';
  idUsuario2FA: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar usuario recordado
    const usuarioRecordado = this.authService.obtenerUsuarioRecordado();
    if (usuarioRecordado) {
      this.usuario = usuarioRecordado;
      this.recordar = true;
    }

    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ingresar(): void {
    this.error = '';
    this.cargando = true;

    this.authService.login(this.usuario, this.password, this.recordar).subscribe({
      next: (response) => {
        this.cargando = false;

        if (response.requiere_2fa) {
          // Mostrar formulario 2FA
          this.mostrar2FA = true;
          this.idUsuario2FA = response.id_usuario || null;
        } else {
          // Login exitoso, redirigir
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.cargando = false;
        this.error = error.message || 'Error al iniciar sesión';
      }
    });
  }

  verificar2FA(): void {
    this.error = '';
    this.cargando = true;

    if (!this.idUsuario2FA || !this.codigo2FA) {
      this.error = 'Ingrese el código de verificación';
      this.cargando = false;
      return;
    }

    this.authService.verify2FA(this.idUsuario2FA, this.codigo2FA).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.cargando = false;
        this.error = error.message || 'Código 2FA inválido';
      }
    });
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  olvidastePassword(): void {
    alert('Contacte al administrador del sistema para recuperar su contraseña.');
  }

}