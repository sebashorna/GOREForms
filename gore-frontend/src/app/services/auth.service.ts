import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface Usuario {
  id_usuario: number;
  usuario: string;
  correo: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  requiere_2fa: boolean;
  id_usuario?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarUsuario();
  }

  login(usuario: string, password: string, recordar: boolean = false): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, { usuario, password, recordar }).pipe(
      map(response => response.data), // Extraer el data del wrapper { success, data, message }
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          if (recordar) {
            localStorage.setItem('usuario_recordado', usuario);
          } else {
            localStorage.removeItem('usuario_recordado');
          }
          this.usuarioSubject.next(response.usuario);
        } else if (response.requiere_2fa) {
          this.usuarioSubject.next(response.usuario);
        }
      }),
      catchError(error => {
        const message = error.error?.message || 'Error al iniciar sesión';
        return throwError(() => new Error(message));
      })
    );
  }

  verify2FA(id_usuario: number, codigo: string): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/verify-2fa`, { id_usuario, codigo }).pipe(
      map(response => response.data),
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.usuarioSubject.next(response.usuario);
        }
      }),
      catchError(error => {
        const message = error.error?.message || 'Código 2FA inválido';
        return throwError(() => new Error(message));
      })
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_recordado');
    this.usuarioSubject.next(null);

    // Llamada al backend para auditoría (no bloqueante)
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe();
    }

    return of(null);
  }

  obtenerUsuarioActual(): Observable<Usuario> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No autenticado'));
    }

    return this.http.get<any>(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => response.data),
      tap(usuario => this.usuarioSubject.next(usuario)),
      catchError(() => {
        localStorage.removeItem('token');
        this.usuarioSubject.next(null);
        return throwError(() => new Error('Token inválido'));
      })
    );
  }

  estaAutenticado(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  obtenerUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  obtenerUsuarioRecordado(): string | null {
    return localStorage.getItem('usuario_recordado');
  }

  private cargarUsuario() {
    const token = localStorage.getItem('token');
    if (token && this.estaAutenticado()) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.usuarioSubject.next({
          id_usuario: payload.id_usuario,
          usuario: payload.usuario,
          correo: '',
          rol: payload.rol
        });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}