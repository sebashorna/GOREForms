import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearEducacionDTO } from '../models/crear-educacion.dto';

@Injectable({
  providedIn: 'root'
})
export class EducacionService {

  private http = inject(HttpClient);

  private api = 'http://192.168.2.194:3000/api/educacion';

  obtenerInstitucion(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  obtenerReporteCompleto(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}/completo`);
  }

  guardarReporteEducacion(dto: CrearEducacionDTO): Observable<any> {

    return this.http.post<any>(
      this.api,
      dto
    );

  }

  obtenerHistorial(filtros?: {
    tipo?: string;
    busqueda?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    usuario?: string;
  }): Observable<any> {

    const params: any = {};

    if (filtros?.tipo) params.tipo = filtros.tipo;
    if (filtros?.busqueda) params.busqueda = filtros.busqueda;
    if (filtros?.fecha_desde) params.fecha_desde = filtros.fecha_desde;
    if (filtros?.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta;
    if (filtros?.usuario) params.usuario = filtros.usuario;

    return this.http.get<any>('http://192.168.2.194:3000/api/historial', { params });

  }

}
