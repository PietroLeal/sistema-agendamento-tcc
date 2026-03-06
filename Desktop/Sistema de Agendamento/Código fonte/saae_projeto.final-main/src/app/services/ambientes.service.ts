import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ambiente } from '../models/ambiente.model';

@Injectable({ providedIn: 'root' })
export class AmbientesService {

  private apiUrl = '/api/ambientes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ambiente[]> {
    return this.http.get<Ambiente[]>(this.apiUrl);
  }

  getById(id: number): Observable<Ambiente> {
    return this.http.get<Ambiente>(`${this.apiUrl}/${id}`);
  }

  create(data: Ambiente): Observable<Ambiente> {
    return this.http.post<Ambiente>(this.apiUrl, data);
  }

  update(id: number, data: Ambiente): Observable<Ambiente> {
    return this.http.put<Ambiente>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
