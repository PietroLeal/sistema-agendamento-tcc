import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgendamentoRecursoService {

  private apiUrl = '/api/agendamento-recursos';

  constructor(private http: HttpClient) {}

  link(agendamentoId: number, recursoId: number): Observable<any> {
    return this.http.post(this.apiUrl, { agendamentoId, recursoId });
  }

  unlink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
