import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService {

  private apiUrl = '/api/perfis';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.apiUrl);
  }

  getById(id: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiUrl}/${id}`);
  }

  create(data: Perfil): Observable<Perfil> {
    return this.http.post<Perfil>(this.apiUrl, data);
  }

  update(id: number, data: Perfil): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
