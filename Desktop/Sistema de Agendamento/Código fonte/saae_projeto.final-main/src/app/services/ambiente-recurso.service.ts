import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AmbienteRecursoService {

  private apiUrl = '/api/ambiente-recursos';

  constructor(private http: HttpClient) {}

  link(ambienteId: number, recursoId: number): Observable<any> {
    return this.http.post(this.apiUrl, { ambienteId, recursoId });
  }

  unlink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
