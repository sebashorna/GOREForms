import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { HistorialService, HistorialItem, HistorialFiltros } from '../../services/historial';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial {
  private historialService = inject(HistorialService);

  historial: HistorialItem[] = [];
  mensaje = '';

  filtros: HistorialFiltros = {
    tipo: '',
    busqueda: '',
    fecha_desde: '',
    fecha_hasta: '',
    usuario: '',
  };

  constructor() {
    this.buscar();
  }

  buscar(): void {
    this.mensaje = 'Cargando...';

    this.historialService.listar(this.filtros).subscribe({
      next: (resp) => {
        this.historial = resp.data || [];
        this.mensaje = '';
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al cargar el historial.';
        this.historial = [];
      },
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      tipo: '',
      busqueda: '',
      fecha_desde: '',
      fecha_hasta: '',
      usuario: '',
    };
    this.buscar();
  }
}