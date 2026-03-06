import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recurso } from '../models/recurso.model';

@Injectable({ providedIn: 'root' })
export class RecursosService {

  private apiUrl = '/api/recursos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(this.apiUrl);
  }
}
