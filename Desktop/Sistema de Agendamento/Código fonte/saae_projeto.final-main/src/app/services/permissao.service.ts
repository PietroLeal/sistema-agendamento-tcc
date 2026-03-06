import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permissao } from '../models/permissao.model';

@Injectable({ providedIn: 'root' })
export class PermissaoService {

  private apiUrl = '/api/permissoes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(this.apiUrl);
  }
}
