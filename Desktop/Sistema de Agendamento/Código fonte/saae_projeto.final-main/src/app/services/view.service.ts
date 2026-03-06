import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewService {

  private apiUrl = '/api/views';

  constructor(private http: HttpClient) {}

  get(viewName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${viewName}`);
  }
}
