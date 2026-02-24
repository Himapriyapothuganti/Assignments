import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService), router = inject(Router);
  const token = auth.getToken();
  const r = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(r).pipe(catchError(err => {
    if (err.status === 401) auth.logout();
    if (err.status === 403) router.navigate(['/access-denied']);
    return throwError(() => err);
  }));
};
