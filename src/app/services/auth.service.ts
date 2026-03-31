import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();
  private checkAuthPromise: Promise<void> | null = null; // Evita múltiplas chamadas

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    this.checkAuth();
  }

  async checkAuth() {
    // Se já está verificando, retorna a mesma promise
    if (this.checkAuthPromise) {
      return this.checkAuthPromise;
    }

    this.checkAuthPromise = (async () => {
      // Se já tem usuário, não precisa verificar de novo
      if (this.currentUserSubject.value) {
        this.loadingSubject.next(false);
        return;
      }

      try {
        const response = await this.api.getMe();
        if (response && response.user) {
          this.currentUserSubject.next(response.user);
        }
      } catch (error) {
        // Não autenticado, mantém null
        this.currentUserSubject.next(null);
      } finally {
        this.loadingSubject.next(false);
        this.checkAuthPromise = null;
      }
    })();

    return this.checkAuthPromise;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.api.login(email, password);
      if (response && response.user) {
        this.currentUserSubject.next(response.user);
        return response;
      }
      throw new Error('Erro ao fazer login');
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.api.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserRole(): Observable<string | null> {
    return new Observable(observer => {
      const user = this.getCurrentUser();
      observer.next(user?.tipo || null);
      observer.complete();
    });
  }
}