import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  // Validaciones
  usuarioInvalido: boolean = false;
  passwordInvalido: boolean = false;
  usuarioError: string = '';
  passwordError: string = '';

  // 2FA
  mostrar2FA: boolean = false;
  codigo2FA: string = '';
  idUsuario2FA: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    this.usuarioInvalido = false;
    this.passwordInvalido = false;
    this.usuarioError = '';
    this.passwordError = '';

    // Validar campos obligatorios
    let valido = true;

    if (!this.usuario || this.usuario.trim() === '') {
      this.usuarioInvalido = true;
      this.usuarioError = 'El usuario es obligatorio';
      valido = false;
    }

    if (!this.password || this.password.trim() === '') {
      this.passwordInvalido = true;
      this.passwordError = 'La contraseña es obligatoria';
      valido = false;
    }

    if (!valido) {
      return;
    }

    this.cargando = true;

    this.authService.login(this.usuario, this.password, this.recordar).subscribe({
      next: (response) => {
        this.cargando = false;

        if (response.requiere_2fa) {
          // Mostrar formulario 2FA
          this.mostrar2FA = true;
          this.idUsuario2FA = response.id_usuario || null;
          this.cdr.detectChanges();
        } else {
          // Login exitoso, redirigir
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.cargando = false;
        this.error = error.message || 'Error al iniciar sesión';
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      }
    });
  }

  volverALogin(): void {
    this.mostrar2FA = false;
    this.codigo2FA = '';
    this.error = '';
    this.cargando = false;
  }

  limpiarErrorUsuario(): void {
    this.usuarioInvalido = false;
    this.usuarioError = '';
  }

  limpiarErrorPassword(): void {
    this.passwordInvalido = false;
    this.passwordError = '';
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  olvidastePassword(): void {
    alert('Contacte al administrador del sistema para recuperar su contraseña.');
  }

}