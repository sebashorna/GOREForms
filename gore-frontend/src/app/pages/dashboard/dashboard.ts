import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  totalProyectos = 0;
  ultimoRegistro = '-';

  ngOnInit(): void {
    console.log('[Dashboard] ngOnInit - estado inicial:', this.totalProyectos, this.ultimoRegistro);

    this.dashboardService.obtenerResumen().subscribe({
      next: (resp) => {
        console.log('[Dashboard] Respuesta recibida:', JSON.stringify(resp));
        if (resp.success && resp.data) {
          this.totalProyectos = resp.data.totalProyectos || 0;
          console.log('[Dashboard] totalProyectos asignado:', this.totalProyectos);

          const fecha = resp.data.ultimoRegistro?.fecha_registro_sistema;
          if (fecha) {
            this.ultimoRegistro = this.formatearFecha(new Date(fecha));
            console.log('[Dashboard] ultimoRegistro asignado:', this.ultimoRegistro);
          }
          this.cdr.detectChanges();
        } else {
          console.warn('[Dashboard] success/data ausente:', resp);
        }
      },
      error: (err) => {
        console.error('[Dashboard] Error al obtener resumen:', err);
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