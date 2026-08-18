import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  totalProyectos = 0;
  ultimoRegistro = '-';

  ngOnInit(): void {
    this.dashboardService.obtenerResumen().subscribe({
      next: (resp) => {
        if (resp.success && resp.data) {
          this.totalProyectos = resp.data.totalProyectos || 0;

          const fecha = resp.data.ultimoRegistro?.fecha_registro_sistema;
          if (fecha) {
            this.ultimoRegistro = this.formatearFecha(new Date(fecha));
          }
        }
      },
      error: (err) => {
        console.error('Error al obtener resumen del dashboard:', err);
      },
    });
  }

  private formatearFecha(fecha: Date): string {
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const yyyy = fecha.getFullYear();
    const hh = String(fecha.getHours()).padStart(2, '0');
    const min = String(fecha.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }
}