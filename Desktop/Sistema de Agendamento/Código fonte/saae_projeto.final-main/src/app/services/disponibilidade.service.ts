import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilidade } from '../models/disponibilidade.model';

@Injectable({ providedIn: 'root' })
export class DisponibilidadeService {

  private apiUrl = '/api/disponibilidades';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Disponibilidade[]> {
    return this.http.get<Disponibilidade[]>(this.apiUrl);
  }
}
