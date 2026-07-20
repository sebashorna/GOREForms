import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistorialItem {
  id_historial: number;
  nombre: string;
  tipo: 'Salud' | 'Educación';
  fecha_modificacion: string;
  usuario: string;
}

export interface HistorialFiltros {
  tipo?: string;
  busqueda?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  usuario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private http = inject(HttpClient);

  private api = 'http://localhost:3000/api/historial';

  listar(filtros?: HistorialFiltros): Observable<any> {
    let params: any = {};
    if (filtros) {
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.busqueda) params.busqueda = filtros.busqueda;
      if (filtros.fecha_desde) params.fecha_desde = filtros.fecha_desde;
      if (filtros.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta;
      if (filtros.usuario) params.usuario = filtros.usuario;
    }
    return this.http.get<any>(this.api, { params });
  }

}