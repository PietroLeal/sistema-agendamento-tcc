import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FuncionarioPerfilService {

  private apiUrl = '/api/funcionario-perfil';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  assign(funcionarioId: number, perfilId: number): Observable<any> {
    return this.http.post(this.apiUrl, { funcionarioId, perfilId });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
