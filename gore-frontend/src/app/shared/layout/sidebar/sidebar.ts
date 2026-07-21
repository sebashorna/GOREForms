import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [ RouterLink ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  usuario: any = null;
  modulosVisibles: string[] = [];

  constructor(private authService: AuthService) {
    this.usuario = this.authService.obtenerUsuario();
    this.actualizarModulosVisibles();
  }

  private actualizarModulosVisibles(): void {
    const rol = this.usuario?.rol || 'HISTORIAL';
    
    const rolesPermitidos: { [key: string]: string[] } = {
      'ADMIN': ['dashboard', 'salud', 'educacion', 'historial'],
      'SALUD': ['dashboard', 'salud', 'historial'],
      'EDUCACION': ['dashboard', 'educacion', 'historial'],
      'HISTORIAL': ['dashboard', 'historial']
    };

    this.modulosVisibles = rolesPermitidos[rol] || ['dashboard', 'historial'];
  }

  tieneAcceso(modulo: string): boolean {
    return this.modulosVisibles.includes(modulo);
  }
}
