import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private api = 'http://192.168.2.194:3000/api/dashboard';

  obtenerResumen(): Observable<any> {
    return this.http.get<any>(`${this.api}/resumen`);
  }

}