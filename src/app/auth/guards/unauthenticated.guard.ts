import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const UnauthenticatedGuard: CanMatchFn = async(
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());

  if (isAuthenticated) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
