import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgendaUsuarioService {

  private apiUrl = '/api/agenda-usuario';

  constructor(private http: HttpClient) {}

  callProcedure(usuarioId: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/executar`, { usuarioId });
  }
}
