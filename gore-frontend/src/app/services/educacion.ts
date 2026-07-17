import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearEducacionDTO } from '../models/crear-educacion.dto';

@Injectable({
  providedIn: 'root'
})
export class EducacionService {

  private http = inject(HttpClient);

  private api = 'http://localhost:3000/api/educacion';

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

}