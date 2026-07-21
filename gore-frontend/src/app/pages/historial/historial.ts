import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  historial: HistorialItem[] = [];
  mensaje = '';

  filtros: HistorialFiltros = {
    tipo: '',
    busqueda: '',
    fecha_desde: '',
    fecha_hasta: '',
    usuario: '',
  };

  constructor() {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.mensaje = 'Cargando...';
    console.log('Buscando historial con filtros:', this.filtros);

    this.historialService.listar(this.filtros).subscribe({
      next: (resp) => {
        console.log('Respuesta recibida:', resp);
        console.log('resp.data:', resp.data);
        console.log('resp.success:', resp.success);
        this.historial = resp.data || [];
        this.mensaje = resp.success ? '' : 'No hay datos';
        console.log('Historial actualizado:', this.historial);
        // Forzar detección de cambios
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en historial:', err);
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