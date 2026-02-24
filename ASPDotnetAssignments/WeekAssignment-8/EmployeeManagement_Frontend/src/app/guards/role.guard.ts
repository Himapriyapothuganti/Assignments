import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const roleGuard = (roles: string[]): CanActivateFn => () => {
  const auth = inject(AuthService), router = inject(Router);
  if (!auth.isLoggedIn()) { router.navigate(['/login']); return false; }
  if (roles.includes(auth.getRole())) return true;
  router.navigate(['/access-denied']); return false;
};
