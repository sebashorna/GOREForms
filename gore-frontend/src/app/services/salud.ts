import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearSaludDTO } from '../models/crear-salud.dto';

@Injectable({
  providedIn: 'root'
})
export class SaludService {

  private http = inject(HttpClient);

  private api = 'http://192.168.2.194:3000/api/salud';

  obtenerEstablecimiento(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  obtenerReporteCompleto(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}/completo`);
  }

  guardarReporteSalud(dto: CrearSaludDTO): Observable<any> {

    return this.http.post<any>(
      this.api,
      dto
    );

  }

}