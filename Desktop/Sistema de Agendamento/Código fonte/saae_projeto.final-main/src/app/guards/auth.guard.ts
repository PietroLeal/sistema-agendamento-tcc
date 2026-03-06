import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token && !authService.isTokenExpired(token)) {
    return true;
  }

  // Se não estiver autenticado, manda para o login
  router.navigate(['/login']);
  return false;
};
